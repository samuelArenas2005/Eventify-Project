from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Rating
from apps.event.models import Event 

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    
    # --- AGREGAR ESTAS DOS LÍNEAS ---
    # Esto permite leer el username y el avatar (si lo tuvieras) en el frontend
    username = serializers.ReadOnlyField(source='user.username')
    # --------------------------------

    class Meta:
        model = Rating
        fields = '__all__'
        read_only_fields = ("id", "date")
        validators = [
            UniqueTogetherValidator(
                queryset=Rating.objects.all(),
                fields=("event", "user"),
                message="Ya has calificado este evento."
            )
        ]
        extra_kwargs = {
            "comment": {"required": False, "allow_blank": True},
        }

    def validate_score(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("La puntuación debe estar entre 1 y 5.")
        return value

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("user", None)
        validated_data.pop("event", None)
        return super().update(instance, validated_data)