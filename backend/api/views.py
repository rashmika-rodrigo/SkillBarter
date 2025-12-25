from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken 

from .models import User, Skill, SwapRequest
from .serializers import UserSerializer, SkillSerializer, SwapRequestSerializer

# ================= VIEWSETS =================

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('-created_at')
    serializer_class = SkillSerializer
    # Automatically uses the JWT Settings from settings.py
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SwapRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(
            Q(requester=user) | Q(provider=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object() 
        new_status = serializer.validated_data.get('status')

        if new_status == 'ACCEPTED' and instance.status != 'ACCEPTED':
            requester = instance.requester
            provider = instance.provider

            if requester.karma_credits < 1:
                raise ValidationError("Requester does not have enough Karma credits!")

            requester.karma_credits -= 1
            provider.karma_credits += 1
            requester.save()
            provider.save()

        serializer.save()


# ================= AUTHENTICATION =================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    
    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)
    
    # Generate Tokens Manually (So they are logged in immediately)
    refresh = RefreshToken.for_user(user)

    # Return User Data + Tokens
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }, status=201)