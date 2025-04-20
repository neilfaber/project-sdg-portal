from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from django.db.models import Count, Case, When, Value, BooleanField, Q
from .models import Project, SDG
from .serializers import (
    ProjectListSerializer, 
    SDGSerializer, 
    CategorySerializer, 
    ProjectDetailSerializer,
    RatingRangeSerializer,
    ProjectSubmissionSerializer,
    ProjectAdminSerializer
)
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from teams.models import TeamMember
from users.models import User
from engagement.models import Feedback

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'faculty'

# Create your views here.

class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.filter(status='approved').prefetch_related('sdgs', 'leaderboard_entry')
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        # Filter by SDG
        sdg_id = self.request.query_params.get('sdg')
        if sdg_id:
            queryset = queryset.filter(sdgs__sdg_id=sdg_id)

        # Filter by year
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(created_at__year=year)

            
        # Filter by rating range
        min_rating = self.request.query_params.get('min_rating')
        max_rating = self.request.query_params.get('max_rating')
        
        if min_rating:
            queryset = queryset.filter(leaderboard_entry__average_rating__gte=float(min_rating))
        if max_rating:
            queryset = queryset.filter(leaderboard_entry__average_rating__lte=float(max_rating))
            
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        categories = Project.objects.values('category').annotate(
            count=Count('category')).order_by('category')
        
        return [{"name": category['category'], "count": category['count']} 
                for category in categories]

class SDGListView(generics.ListAPIView):
    queryset = SDG.objects.all()
    serializer_class = SDGSerializer

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    lookup_field = 'project_id'

    def get_queryset(self):
        return Project.objects.prefetch_related(
            'sdgs',
            'team__teammember_set__user',
            'leaderboard_entry'
        )
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class RatingRangeListView(generics.ListAPIView):
    serializer_class = RatingRangeSerializer
    
    def get_queryset(self):
        # Define rating ranges
        ranges = [
            {'min': 4.5, 'max': 5.0, 'label': '4.5 - 5.0'},
            {'min': 4.0, 'max': 4.4, 'label': '4.0 - 4.4'},
            {'min': 3.5, 'max': 3.9, 'label': '3.5 - 3.9'},
            {'min': 3.0, 'max': 3.4, 'label': '3.0 - 3.4'},
            {'min': 2.5, 'max': 2.9, 'label': '2.5 - 2.9'},
            {'min': 2.0, 'max': 2.4, 'label': '2.0 - 2.4'},
            {'min': 1.0, 'max': 1.9, 'label': '1.0 - 1.9'},
        ]
        
        result = []
        for range_def in ranges:
            count = Project.objects.filter(
                leaderboard_entry__average_rating__gte=range_def['min'],
                leaderboard_entry__average_rating__lte=range_def['max']
            ).count()
            
            result.append({
                'range': range_def['label'],
                'count': count,
                'min_rating': range_def['min'],
                'max_rating': range_def['max']
            })
        
        return result

class ProjectSubmissionView(generics.CreateAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # The team is already included in the validated data from the request
        serializer.save()

class AdminProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()  # Changed to show all projects
    serializer_class = ProjectAdminSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        project = self.get_object()
        project.status = 'approved'
        project.admin_remarks = request.data.get('remarks', '')
        project.save()
        return Response({'status': 'project approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        project = self.get_object()
        project.status = 'rejected'
        project.admin_remarks = request.data.get('remarks', '')
        project.save()
        return Response({'status': 'project rejected'})

    @action(detail=True, methods=['post'])
    def assign_teacher(self, request, pk=None):
        project = self.get_object()
        teacher_id = request.data.get('teacher_id')
        
        try:
            # Accept both 'teacher' and 'faculty' roles
            teacher = User.objects.filter(
                id=teacher_id, 
                role__in=['teacher', 'faculty'], 
                status='active'
            ).first()
            
            if not teacher:
                return Response(
                    {'error': 'Teacher not found or user is not an active teacher/faculty'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            return Response(
                {'error': f'Error finding teacher: {str(e)}'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Add teacher to the project's team
        team = project.team
        if TeamMember.objects.filter(team=team, user=teacher).exists():
            return Response(
                {'error': 'Teacher is already assigned to this project'},
                status=status.HTTP_400_BAD_REQUEST
            )

        TeamMember.objects.create(team=team, user=teacher)
        return Response({
            'status': 'teacher assigned successfully',
            'teacher': {
                'id': teacher.id,
                'full_name': teacher.full_name,
                'role': teacher.role
            }
        })

class YourView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Access authenticated user with request.user
        return Response({"message": f"Hello {request.user.full_name}"})

class UserProjectsView(generics.ListAPIView):
    """View to return all projects associated with the current user, including pending ones."""
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Get teams that the user is a member of
        user_teams = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
        
        # Get all projects from those teams, regardless of status
        queryset = Project.objects.filter(team_id__in=user_teams).prefetch_related('sdgs', 'leaderboard_entry')
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class RejectedProjectsView(generics.ListAPIView):
    """View to return all rejected projects for admin review."""
    serializer_class = ProjectAdminSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        # Get all projects with rejected status
        queryset = Project.objects.filter(status='rejected').prefetch_related('sdgs', 'team')
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class FeedbackCreateView(generics.CreateAPIView):
    """API endpoint to create feedback for a project by faculty"""
    permission_classes = [IsFaculty]
    
    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        rating = request.data.get('rating')
        content = request.data.get('content')
        
        # Validate data
        if not all([project_id, rating, content]):
            return Response(
                {"error": "Missing required fields. Please provide project_id, rating, and content."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Ensure the project exists
            project = Project.objects.get(project_id=project_id)
            
            # Check if the faculty is assigned to this project's team
            user = request.user
            team = project.team
            is_assigned = TeamMember.objects.filter(team=team, user=user).exists()
            
            if not is_assigned and user.role != 'admin':
                return Response(
                    {"error": "You are not assigned to this project and cannot provide feedback."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            # Create the feedback
            feedback = Feedback.objects.create(
                project=project,
                user=user,
                rating=rating,
                comment=content
            )
            
            return Response({
                "success": True,
                "message": "Feedback submitted successfully",
                "feedback_id": feedback.feedback_id
            }, status=status.HTTP_201_CREATED)
            
        except Project.DoesNotExist:
            return Response(
                {"error": f"Project with ID {project_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error creating feedback: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
