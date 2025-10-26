from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (IsAuthenticated, AllowAny)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            res = Response()
            res.data = {"success": True}
            res.set_cookie("access_token", access_token, httponly=True, secure=True, samesite='None', path='/')
            res.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite='None', path='/')
            return res
        except:
            return Response({"success": False, "error": "Invalid credentials"}, status=401)
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()
            res.data = {'success': True}
            res.set_cookie("access_token", value=access_token, httponly=True, secure=True, samesite='None', path='/')
            return res  # ← Añade esto
        except:
            return Response({"success": False, "error": "Invalid refresh token"})
        
@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    try:
        res = Response()
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        res.data = {'success': True}
        return res
    except:
        return Response({'success': False, 'error': 'Error during logout'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'success': True})
