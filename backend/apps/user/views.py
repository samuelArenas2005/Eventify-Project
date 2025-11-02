from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # por defecto para operaciones protegidas

    def get_permissions(self):
        # Permitir registro público (POST /users/)
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        # Usar serializer de registro al crear
        if self.action == 'create':
            return UserRegistrationSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Devuelve el usuario autenticado en /api/user/users/me/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
        


