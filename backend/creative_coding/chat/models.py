from django.db import models
from users.models import User
from teams.models import StudentTeam
from projects.models import Project

class ChatRoom(models.Model):
    """Chat room model for team-teacher communication"""
    room_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(StudentTeam, on_delete=models.CASCADE, related_name='chat_rooms')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='chat_rooms', null=True, blank=True)
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='faculty_chat_rooms')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_rooms'
        unique_together = ('team', 'faculty')
    
    def __str__(self):
        return f"{self.name} - {self.team.team_name} and {self.faculty.full_name}"

class ChatMessage(models.Model):
    """Messages sent in a chat room"""
    message_id = models.AutoField(primary_key=True)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Message from {self.sender.full_name} in {self.room.name}" 