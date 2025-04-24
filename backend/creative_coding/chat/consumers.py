import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, ChatMessage
from users.models import User
from teams.models import TeamMember

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Get user from scope (requires AuthMiddlewareStack)
        user = self.scope.get('user', None)
        
        # Debug logging
        logger.info(f"WebSocket connect attempt: room_id={self.room_id}, user={user}")
        
        # Verify user is authenticated
        if user is None or user.is_anonymous:
            logger.warning(f"WebSocket authentication failed: No valid user in scope")
            await self.close(code=4003)
            return
            
        # Check if user has access to this room
        try:
            has_access = await self.check_room_access(user.id, self.room_id)
            if not has_access:
                logger.warning(f"WebSocket access denied: User {user.id} has no access to room {self.room_id}")
                await self.close(code=4004)
                return
        except Exception as e:
            logger.error(f"Error checking room access: {str(e)}")
            await self.close(code=4500)
            return
            
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        logger.info(f"WebSocket connected: user={user.id}, room={self.room_id}")
        await self.accept()
        
    async def disconnect(self, close_code):
        logger.info(f"WebSocket disconnected: room={self.room_id}, code={close_code}")
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_content = data.get('message', '')
            user = self.scope.get('user')
            
            if user is None or user.is_anonymous:
                logger.warning(f"Message rejected: User not authenticated")
                return
                
            user_id = user.id
            
            # Save the message to the database
            message = await self.save_message(user_id, self.room_id, message_content)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'sender_id': user_id,
                    'sender_name': user.full_name,
                    'sender_role': user.role,
                    'timestamp': message['timestamp'].isoformat(),
                    'message_id': message['message_id']
                }
            )
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
        
    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
            'sender_role': event['sender_role'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id']
        }))
        
    @database_sync_to_async
    def check_room_access(self, user_id, room_id):
        try:
            user = User.objects.get(id=user_id)
            chat_room = ChatRoom.objects.get(room_id=room_id)
            
            # Faculty has access if they are assigned to this room
            if user.role == 'faculty' and chat_room.faculty_id == user.id:
                return True
                
            # Student has access if they are in the team
            if user.role == 'student':
                return TeamMember.objects.filter(team=chat_room.team, user=user).exists()
                
            # Admin has access to all rooms
            if user.role == 'admin':
                return True
                
            return False
        except (User.DoesNotExist, ChatRoom.DoesNotExist) as e:
            logger.error(f"Room access check error: {str(e)}")
            return False
            
    @database_sync_to_async
    def save_message(self, user_id, room_id, content):
        user = User.objects.get(id=user_id)
        room = ChatRoom.objects.get(room_id=room_id)
        
        message = ChatMessage.objects.create(
            room=room,
            sender=user,
            content=content
        )
        
        return {
            'message_id': message.message_id,
            'timestamp': message.timestamp
        } 