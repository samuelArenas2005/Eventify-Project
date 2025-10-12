from rest_framework import serializers
from .models import Event, Category, EventAttendee
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EventAttendeeSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = EventAttendee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class EventListSerializer(serializers.ModelSerializer):
    creator = UserBasicSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    attendees_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'main_image', 
            'start_date', 'end_date', 'address', 
            'location_info',
            'capacity', 'status', 'creator', 
            'categories', 'attendees_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_attendees_count(self, obj):
        return obj.attendees.count()

class EventDetailSerializer(EventListSerializer):
    attendees = EventAttendeeSerializer(
        source='eventattendee_set',
        many=True,
        read_only=True
    )

    class Meta(EventListSerializer.Meta):
        fields = EventListSerializer.Meta.fields + ['attendees']

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'main_image',
            'start_date', 'end_date', 'address',
            'location_info',
            'capacity', 'status', 'categories'
        ]

    def validate(self, data):
        # Validate start_date is before end_date
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError({
                    "end_date": "End date must be after start date"
                })
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['creator'] = user
        return super().create(validated_data)
