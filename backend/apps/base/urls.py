from .views import (CustomTokenObtainPairView, CustomTokenRefreshView, logout, is_authenticated)
from django.urls import path

urlpatterns = [
    path('', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='is_authenticated')
]