# urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    CategoryViewSet,
    EventViewSet,
    EventAttendeeViewSet,
    ConfirmedAttendeesList,
    PendingAttendeesList,
    EventsByCreatorList,
    ActiveEventsList,
    AllRegisteredEventsList,
    AllCreatedEventsList,
    EventDailyCreatedCountView,
    PopularUpcomingEventsView,
    generate_image,
    ConfirmEventRegistrationView,
)


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendees', EventAttendeeViewSet, basename='eventattendee')

urlpatterns = [
    path('', include(router.urls)),
    path('confirmed/', ConfirmedAttendeesList.as_view(), name='confirmed-attendees'),
    path('pending/', PendingAttendeesList.as_view(), name='pending-attendees'),
    path('created/', EventsByCreatorList.as_view(), name='events-by-creator'),   
    path('active/', ActiveEventsList.as_view(), name='active-events'),
    path('registered/all/', AllRegisteredEventsList.as_view(), name='all-registered-events'),
    path('created/all/', AllCreatedEventsList.as_view(), name='all-created-events'),
    path('analytics/events-per-day/', EventDailyCreatedCountView.as_view(), name='events-created-per-day'),
    path('analytics/popular-upcoming/', PopularUpcomingEventsView.as_view(), name='analytics-popular-upcoming'),
    path('generate-image/', generate_image),
    path('register/confirm/<int:event_id>/', ConfirmEventRegistrationView.as_view(), name='confirm-event-registration'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
