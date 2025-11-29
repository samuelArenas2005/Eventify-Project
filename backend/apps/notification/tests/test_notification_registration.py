from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.event.models import Category, Event, EventAttendee
from apps.notification.models import Notification, UserNotification


class NotificationRegistrationTests(APITestCase):
    """Integration tests covering notification subscription on event registration."""

    def setUp(self):
        user_model = get_user_model()
        self.creator = user_model.objects.create_user(
            username="creator_test",
            email="creator_test@example.com",
            password="pass1234",
            name="Creator",
            last_name="Test",
            cedula="1000000001",
        )
        self.attendee = user_model.objects.create_user(
            username="attendee_test",
            email="attendee_test@example.com",
            password="pass1234",
            name="Attendee",
            last_name="Test",
            cedula="1000000002",
        )

        category, _ = Category.objects.get_or_create(name="Test Category")
        start_date = timezone.now() + timedelta(days=2)
        self.event = Event.objects.create(
            title="Test Event Notification",
            description="Testing notifications",
            start_date=start_date,
            end_date=start_date + timedelta(hours=2),
            location_info="Test Location",
            address="Test Address",
            capacity=50,
            status=Event.ACTIVE,
            creator=self.creator,
            category=category,
        )

        reminder_at = self.event.start_date - timedelta(days=1)
        self.notification = Notification.objects.create(
            event=self.event,
            type=Notification.NotificationType.REMINDER,
            message=(
                f"Reminder! Your event '{self.event.title}' starts tomorrow at "
                f"{self.event.start_date.strftime('%H:%M')}."
            ),
            visible_at=reminder_at,
        )
        UserNotification.objects.create(
            user=self.creator,
            notification=self.notification,
            state=UserNotification.State.DELIVERED,
        )

    def test_user_gets_subscribed_to_reminder_on_registration(self):
        url = reverse("confirm-event-registration", args=[self.event.id])
        self.client.force_authenticate(user=self.attendee)

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            UserNotification.objects.filter(
                user=self.attendee,
                notification=self.notification,
            ).exists()
        )
        self.assertTrue(
            EventAttendee.objects.filter(
                event=self.event,
                user=self.attendee,
                status="REGISTERED",
            ).exists()
        )

    def test_duplicate_registration_does_not_duplicate_notification(self):
        url = reverse("confirm-event-registration", args=[self.event.id])
        self.client.force_authenticate(user=self.attendee)

        first_response = self.client.post(url)
        second_response = self.client.post(url)

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            UserNotification.objects.filter(
                user=self.attendee,
                notification=self.notification,
            ).count(),
            1,
        )
