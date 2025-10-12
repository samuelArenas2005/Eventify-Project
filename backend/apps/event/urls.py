# urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, EventViewSet, EventAttendeeViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendees', EventAttendeeViewSet, basename='eventattendee')

urlpatterns = [
    path('/', include(router.urls)),
]
