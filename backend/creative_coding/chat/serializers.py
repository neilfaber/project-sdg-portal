from rest_framework import serializers
from .models import ChatRoom, ChatMessage
from users.serializers import UserSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['message_id', 'room', 'sender', 'sender_name', 'sender_role', 
                  'sender_id', 'content', 'timestamp', 'is_read']
        read_only_fields = ['message_id', 'timestamp', 'is_read']

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    team_name = serializers.CharField(source='team.team_name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.full_name', read_only=True)
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['room_id', 'team', 'team_name', 'faculty', 'faculty_name', 
                  'name', 'created_at', 'latest_message', 'unread_count', 'project']
        read_only_fields = ['room_id', 'created_at']
    
    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-timestamp').first()
        if latest:
            return {
                'content': latest.content,
                'timestamp': latest.timestamp,
                'sender_name': latest.sender.full_name
            }
        return None
    
    def get_unread_count(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user:
            return obj.messages.filter(is_read=False).exclude(sender=user).count()
        return 0 