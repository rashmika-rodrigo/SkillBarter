from rest_framework import serializers
from .models import User, Skill, SwapRequest

# User Serializer (What user data should send to frontend)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'location', 'karma_credits']


# Skill Serializer
class SkillSerializer(serializers.ModelSerializer):
    user_info = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Skill
        fields = ['id', 'user', 'user_info', 'title', 'description', 'category', 'created_at']
        read_only_fields = ['user'] 
        

# Swap Request Serializer
class SwapRequestSerializer(serializers.ModelSerializer):
    requester_info = UserSerializer(source='requester', read_only=True)
    provider_info = UserSerializer(source='provider', read_only=True)
    skill_title = serializers.CharField(source='skill.title', read_only=True)

    class Meta:
        model = SwapRequest
        fields = ['id', 'requester', 'requester_info', 'provider', 'provider_info', 'skill', 'skill_title', 'message', 'status', 'created_at']
        read_only_fields = ['requester']