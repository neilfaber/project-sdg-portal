from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Avg, Count, Q
from .models import Feedback, Leaderboard
from .serializers import FeedbackSerializer, LeaderboardSerializer
from projects.models import Project

# Create your views here.

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Feedback.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id is not None:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    @action(detail=False, methods=['get'])
    def project_stats(self, request):
        """Get aggregated feedback stats for a project"""
        project_id = request.query_params.get('project', None)
        if not project_id:
            return Response(
                {'error': 'Project ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        stats = Feedback.objects.filter(project_id=project_id).aggregate(
            total_ratings=Count('feedback_id'),
            average_rating=Avg('rating'),
            total_comments=Count('comment', filter=Q(comment__isnull=False))
        )

        return Response(stats)

    def create(self, request, *args, **kwargs):
        # Check if user has already given feedback for this project
        project_id = request.data.get('project')
        if Feedback.objects.filter(user=request.user, project_id=project_id).exists():
            return Response(
                {'error': 'You have already provided feedback for this project'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top rated projects"""
        limit = int(request.query_params.get('limit', 10))
        queryset = self.get_queryset().order_by('-average_rating', '-total_ratings')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def most_reviewed(self, request):
        """Get most reviewed projects"""
        limit = int(request.query_params.get('limit', 10))
        queryset = self.get_queryset().order_by('-total_ratings', '-average_rating')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
