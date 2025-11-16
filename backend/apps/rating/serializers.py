from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Rating
from apps.event.models import Event 


class RatingSerializer(serializers.ModelSerializer):
    """
    Serializer para calificaciones de eventos.
    
    user se toma del request automáticamente (no se envía desde el cliente).
    event se envía por ID (PK).
    Garantiza unicidad (user, event) también a nivel de serializer.
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

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
        # Los validators del modelo ya controlan 1–5, pero mantenemos un mensaje claro aquí.
        if not (1 <= value <= 5):
            raise serializers.ValidationError("La puntuación debe estar entre 1 y 5.")
        return value

    def create(self, validated_data):
        """
        user viene del HiddenField (request.user). Si necesitas
        proteger que no se pase user manualmente, ya está cubierto.
        """
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Evita que se cambien user/event en updates.
        """
        validated_data.pop("user", None)
        validated_data.pop("event", None)
        return super().update(instance, validated_data)