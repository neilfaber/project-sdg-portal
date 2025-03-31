from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.db.models import Count
from .models import Project, SDG
from .serializers import (
    ProjectListSerializer, 
    SDGSerializer, 
    CategorySerializer, 
    ProjectDetailSerializer
)

# Create your views here.

class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    
    def get_queryset(self):
        queryset = Project.objects.all().prefetch_related('sdgs', 'leaderboard_entry')
        
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
