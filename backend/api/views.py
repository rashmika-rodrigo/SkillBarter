from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import User, Skill, SwapRequest
from .serializers import UserSerializer, SkillSerializer, SwapRequestSerializer

# ================= VIEWSETS =================
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('-created_at')
    serializer_class = SkillSerializer
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
@ensure_csrf_cookie 
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        response = Response(UserSerializer(user).data)
        get_token(request) # Force token refresh
        return response
    else:
        return Response({"error": "Invalid Credentials"}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie 
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return Response(UserSerializer(user).data, status=201)


# ================= SYSTEM (The Handshake) =================

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie 
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})