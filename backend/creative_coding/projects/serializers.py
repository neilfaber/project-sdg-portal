from rest_framework import serializers
from .models import Project, SDG, ProjectSDG
from teams.models import StudentTeam
from engagement.models import Leaderboard

class SDGSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDG
        fields = ['sdg_id', 'sdg_name']

class ProjectListSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.team_name', read_only=True)
    sdgs = SDGSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['project_id', 'title', 'description', 'category', 
                 'github_link', 'media_link', 'thumbnail_url', 'created_at', 
                 'team_name', 'sdgs', 'average_rating', 'total_ratings']
    
    def get_average_rating(self, obj):
        try:
            return obj.leaderboard_entry.average_rating
        except:
            return 0.0
    
    def get_total_ratings(self, obj):
        try:
            return obj.leaderboard_entry.total_ratings
        except:
            return 0
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail and hasattr(obj.thumbnail, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

class CategorySerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField() 