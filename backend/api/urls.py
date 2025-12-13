from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SkillViewSet, SwapRequestViewSet, login_view, register_view, get_csrf_token

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'swaps', SwapRequestViewSet, basename='swaprequest')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view),
    path('register/', register_view),
    path('csrf/', get_csrf_token),
]