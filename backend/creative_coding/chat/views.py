from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer
from users.models import User
from teams.models import StudentTeam, TeamMember
from django.db.models import Q
from django.shortcuts import get_object_or_404

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter chat rooms based on user's role"""
        user = self.request.user
        
        if user.role == 'faculty':
            # Faculty sees all chat rooms where they are assigned
            return ChatRoom.objects.filter(faculty=user)
        elif user.role == 'student':
            # Students see chat rooms for teams they belong to
            team_ids = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
            return ChatRoom.objects.filter(team_id__in=team_ids)
        elif user.role == 'admin':
            # Admins see all chat rooms
            return ChatRoom.objects.all()
        # Other roles don't see chat rooms
        return ChatRoom.objects.none()
    
    def create(self, request, *args, **kwargs):
        # Validate that the user is a faculty member or an admin
        if request.user.role not in ['faculty', 'admin']:
            return Response(
                {"error": "Only faculty or admin can create a chat room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        data = request.data.copy()
        
        # If faculty field is not provided, set it to the current user
        if 'faculty' not in data and request.user.role == 'faculty':
            data['faculty'] = request.user.id
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def for_team(self, request):
        """Get chat rooms for a specific team"""
        team_id = request.query_params.get('team_id')
        if not team_id:
            return Response({"error": "team_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if user is in the team or is a faculty assigned to the team
        user = request.user
        team = get_object_or_404(StudentTeam, team_id=team_id)
        
        if user.role == 'student':
            is_member = TeamMember.objects.filter(team=team, user=user).exists()
            if not is_member:
                return Response(
                    {"error": "You are not a member of this team"},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Get chat rooms for this team
        chat_rooms = ChatRoom.objects.filter(team_id=team_id)
        serializer = self.get_serializer(chat_rooms, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a specific chat room"""
        chat_room = self.get_object()
        
        # Check if user has access to this chat room
        user = request.user
        has_access = False
        
        if user.role == 'faculty' and chat_room.faculty == user:
            has_access = True
        elif user.role == 'student':
            is_member = TeamMember.objects.filter(team=chat_room.team, user=user).exists()
            has_access = is_member
        elif user.role == 'admin':
            has_access = True
            
        if not has_access:
            return Response(
                {"error": "You do not have access to this chat room"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Mark messages as read
        unread_messages = ChatMessage.objects.filter(
            room=chat_room, 
            is_read=False
        ).exclude(sender=user)
        
        for message in unread_messages:
            message.is_read = True
            message.save()
            
        # Get all messages
        messages = ChatMessage.objects.filter(room=chat_room)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter messages based on room_id"""
        room_id = self.request.query_params.get('room_id')
        if room_id:
            return ChatMessage.objects.filter(room_id=room_id)
        return ChatMessage.objects.none()
    
    def perform_create(self, serializer):
        """Set sender to current user when creating a message"""
        serializer.save(sender=self.request.user)
        
    def create(self, request, *args, **kwargs):
        """Custom create to validate user's access to the chat room"""
        room_id = request.data.get('room')
        if not room_id:
            return Response(
                {"error": "room_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if the chat room exists
        try:
            chat_room = ChatRoom.objects.get(room_id=room_id)
        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chat room does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Check if user has access to this chat room
        user = request.user
        has_access = False
        
        if user.role == 'faculty' and chat_room.faculty == user:
            has_access = True
        elif user.role == 'student':
            is_member = TeamMember.objects.filter(team=chat_room.team, user=user).exists()
            has_access = is_member
        elif user.role == 'admin':
            has_access = True
            
        if not has_access:
            return Response(
                {"error": "You do not have access to this chat room"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(sender=user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers) 