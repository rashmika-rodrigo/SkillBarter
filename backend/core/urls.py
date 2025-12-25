from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
    
    # ====================================================
    # JWT AUTH ENDPOINTS
    # ====================================================
    # Login (Send username/password -> Get Tokens)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Refresh (Send Refresh Token -> Get new Access Token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]