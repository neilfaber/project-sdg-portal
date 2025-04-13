from rest_framework import serializers
from .models import StudentTeam, TeamMember, MentorshipRequest
from users.models import User

class TeamMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = ['full_name', 'role']

class TeamMemberCreateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

class StudentTeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = StudentTeam
        fields = ['team_id', 'team_name', 'created_by', 'created_by_name', 'created_at', 'members']
        read_only_fields = ['created_by', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure members are properly serialized
        data['members'] = TeamMemberSerializer(
            TeamMember.objects.filter(team=instance),
            many=True
        ).data
        return data

class MentorshipRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.full_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = MentorshipRequest
        fields = [
            'request_id', 'student', 'student_name', 'faculty', 'faculty_name',
            'project', 'project_title', 'status', 'request_date'
        ]
        read_only_fields = ['request_date', 'student', 'status']

    def validate(self, data):
        # Check if faculty exists and is actually a faculty member
        faculty = data.get('faculty')
        if not faculty or faculty.role != 'faculty':
            raise serializers.ValidationError("Selected faculty member is invalid or not a faculty member")

        # Check if project exists and belongs to the student's team
        project = data.get('project')
        if not project:
            raise serializers.ValidationError("Project is required")
        
        # The student creating the request must be a member of the project's team
        student = self.context['request'].user
        if not TeamMember.objects.filter(team=project.team, user=student).exists():
            raise serializers.ValidationError("You must be a member of the project's team to request mentorship")

        # Check if there's already a pending request for this project and faculty
        existing_request = MentorshipRequest.objects.filter(
            project=project,
            faculty=faculty,
            status='pending'
        ).exists()
        
        if existing_request:
            raise serializers.ValidationError("A pending mentorship request already exists for this project and faculty")

        return data

