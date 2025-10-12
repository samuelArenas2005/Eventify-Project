
from rest_framework.routers import DefaultRouter
from .views import RatingViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('/', include(router.urls)),
]