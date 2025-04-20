from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSignupSerializer, UserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import exception_handler
from rest_framework.decorators import action
from rest_framework import viewsets

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

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin management of users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.all().order_by('-created_at')
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Update user status (active, inactive, pending)
        """
        user = self.get_object()
        status = request.data.get('status')
        
        if status not in ['active', 'inactive', 'pending']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.status = status
        user.save()
        
        return Response({'status': f'User status updated to {status}'})

class ListUsersView(generics.ListAPIView):
    """
    View to list all active students in the system.
    Used for team member selection in projects.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        # Only return active students, excluding the requesting user
        return User.objects.filter(
            status='active',
            role='student'
        ).exclude(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': 'success',
            'users': serializer.data
        })

class ListTeachersView(generics.ListAPIView):
    """
    View to list all teachers in the system.
    Only accessible by admin and management users.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role not in ['admin', 'management']:
            return User.objects.none()
        return User.objects.filter(role='teacher').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        user = request.user
        if user.role not in ['admin', 'management']:
            return Response(
                {'error': 'You do not have permission to view this resource'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': 'success',
            'teachers': serializer.data
        })

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


