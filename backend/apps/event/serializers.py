from rest_framework import serializers
from .models import Event, Category, EventAttendee, EventImage
from django.contrib.auth import get_user_model
from apps.rating.models import Rating

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

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['created_at']

class EventListSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    creator = UserBasicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    attendees_count = serializers.SerializerMethodField()
    images = EventImageSerializer(many=True, read_only=True)
    
    # NUEVO CAMPO: Para saber si el usuario ya calificó este evento
    my_rating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'main_image', 
            'start_date', 'end_date', 'address', 
            'location_info', 'capacity', 'status', 
            'creator', 'category', 'attendees_count',
            'images', 
            'my_rating', # <--- No olvides agregarlo aquí
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_attendees_count(self, obj):
        return obj.attendees.count()

    def get_my_rating(self, obj):
        """
        Devuelve la calificación del usuario actual para este evento.
        Retorna null si no lo ha calificado.
        """
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Usamos 'ratings' porque es el related_name definido en tu modelo Rating
            rating = obj.ratings.filter(user=request.user).first()
            if rating:
                return {
                    "id": rating.id,
                    "score": rating.score,
                    "comment": rating.comment
                }
        return None
        
class EventAttendeeSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    event = EventListSerializer(read_only=True)

    class Meta:
        model = EventAttendee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class EventDetailSerializer(EventListSerializer):
    attendees = EventAttendeeSerializer(
        source='eventattendee_set',
        many=True,
        read_only=True
    )

    class Meta(EventListSerializer.Meta):
        fields = EventListSerializer.Meta.fields + ['attendees']



class EventCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False
    )

    class Meta:
        model = Event
        fields = [
            'id','title', 'description', 'main_image',
            'start_date', 'end_date', 'address',
            'location_info', 'capacity', 'status', 
            'category', 'images' 
        ]

    def validate(self, data):
        # Validate start_date is before end_date
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError({
                    "end_date": "End date must be after start date"
                })
        # Solo validar category en creación (no en actualización parcial)
        if not self.instance and not data.get('category'):
            raise serializers.ValidationError({
                "category": "A category must be specified"
            })
        return data

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        user = self.context['request'].user
        validated_data['creator'] = user
        event = super().create(validated_data)
        
        # Create event images
        for image in images_data:
            EventImage.objects.create(event=event, image=image)
        
        return event

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        event = super().update(instance, validated_data)
        
        # Add new images
        for image in images_data:
            EventImage.objects.create(event=event, image=image)
            
        return event


