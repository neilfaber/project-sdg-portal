from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSignupSerializer, UserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import exception_handler

User = get_user_model()

# Create your views here.

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSignupSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# Custom exception handler
def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        response.data['status_code'] = response.status_code
        
        if isinstance(exc, ValidationError):
            response.data['message'] = 'Validation error'
        elif isinstance(exc, AuthenticationFailed):
            response.data['message'] = 'Authentication failed'
        elif isinstance(exc, ObjectDoesNotExist):
            response.data['message'] = 'Resource not found'
        
    return response


