from rest_framework import serializers
from .models import TeamMember  # Only import what's needed from teams models

class TeamMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    role = serializers.CharField(source='user.role')
    
    class Meta:
        model = TeamMember
        fields = ['full_name', 'role']

