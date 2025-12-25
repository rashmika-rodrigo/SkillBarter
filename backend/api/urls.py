from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SkillViewSet, SwapRequestViewSet, register_view

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'swaps', SwapRequestViewSet, basename='swaprequest')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_view),
]