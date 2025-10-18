# urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import CategoryViewSet, EventViewSet, EventAttendeeViewSet,ConfirmedAttendeesByUserList,PendingAttendeesByUserList\
    ,EventsByCreatorList


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendees', EventAttendeeViewSet, basename='eventattendee')

urlpatterns = [
    path('/', include(router.urls)),
    path('/user/<int:user_id>/confirmed',
         ConfirmedAttendeesByUserList.as_view(),
         name='confirmed-attendees-by-user'),
    path('/user/<int:user_id>/pending',
         PendingAttendeesByUserList.as_view(),
         name='pending-attendees-by-user'),
    path('/by-creator/<int:user_id>', EventsByCreatorList.as_view(), name='events-by-creator'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
