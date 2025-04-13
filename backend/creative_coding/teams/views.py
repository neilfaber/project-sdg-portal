from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StudentTeam, TeamMember, MentorshipRequest
from .serializers import (
    StudentTeamSerializer,
    TeamMemberSerializer,
    MentorshipRequestSerializer,
    TeamMemberCreateSerializer
)
from users.models import User
from django.db.models import Q

class IsTeamCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user

class StudentTeamViewSet(viewsets.ModelViewSet):
    queryset = StudentTeam.objects.all()
    serializer_class = StudentTeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return StudentTeam.objects.all().distinct()
        
        # Get teams where user is either a creator or a member
        return StudentTeam.objects.filter(
            Q(created_by=user) | 
            Q(teammember__user=user)
        ).distinct()

    def perform_create(self, serializer):
        # Save the team with the creator
        team = serializer.save(created_by=self.request.user)
        
        # Automatically add the creator as a team member
        TeamMember.objects.create(team=team, user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        
        # Check if the requesting user is the team creator
        if team.created_by != request.user:
            return Response(
                {'error': 'Only the team creator can add members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TeamMemberCreateSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            try:
                user = User.objects.get(id=user_id)
                # Check if the user to be added is a student
                if user.role != 'student':
                    return Response(
                        {'error': 'Only students can be added to teams'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Check if user is already a member
                if TeamMember.objects.filter(team=team, user=user).exists():
                    return Response(
                        {'error': 'User is already a member of this team'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                TeamMember.objects.create(team=team, user=user)
                return Response({'status': 'member added'}, status=status.HTTP_201_CREATED)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        
        # Check if the requesting user is the team creator
        if team.created_by != request.user:
            return Response(
                {'error': 'Only the team creator can remove members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        try:
            member = TeamMember.objects.get(team=team, user_id=user_id)
            # Prevent removing the team creator
            if member.user == team.created_by:
                return Response(
                    {'error': 'Cannot remove the team creator'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            member.delete()
            return Response({'status': 'member removed'})
        except TeamMember.DoesNotExist:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        team = self.get_object()
        members = TeamMember.objects.filter(team=team)
        serializer = TeamMemberSerializer(members, many=True)
        return Response(serializer.data)

class MentorshipRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorshipRequest.objects.all()
    serializer_class = MentorshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return MentorshipRequest.objects.filter(student=user)
        elif user.role == 'admin':
            return MentorshipRequest.objects.all()
        return MentorshipRequest.objects.none()

    def perform_create(self, serializer):
        # Only students can create mentorship requests
        if self.request.user.role != 'student':
            return Response(
                {'error': 'Only students can create mentorship requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        mentorship_request = self.get_object()
        
        # Only admins can approve mentorship requests
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can approve mentorship requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        mentorship_request.status = 'approved'
        mentorship_request.save()
        
        # Connect the team to the faculty
        team = mentorship_request.project.team
        faculty = mentorship_request.faculty
        TeamMember.objects.create(team=team, user=faculty)
        
        return Response({'status': 'request approved and faculty connected to team'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        mentorship_request = self.get_object()
        
        # Only admins can reject mentorship requests
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can reject mentorship requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        mentorship_request.status = 'rejected'
        mentorship_request.save()
        return Response({'status': 'request rejected'})
