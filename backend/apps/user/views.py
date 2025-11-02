from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action == 'me':
            permission_classes = [IsAuthenticated]  # Solo autenticado para obtener su usuario
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]  # Requiere auth + staff para otras (ej. list)
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        """
        Returns the appropriate serializer class based on the request action.
        """
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Devuelve el usuario autenticado actual.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
        


