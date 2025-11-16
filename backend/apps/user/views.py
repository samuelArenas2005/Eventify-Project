from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, UserUpdateSerializer

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
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """
        Actualiza la información del usuario autenticado en /api/user/users/update_me/
        Permite actualizar: password, email, username, name, last_name, phone, avatar, codigo
        """
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Devolver los datos actualizados con el serializer principal
            updated_serializer = UserSerializer(user)
            return Response(updated_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


