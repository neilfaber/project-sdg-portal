from rest_framework import serializers
from .models import Project, SDG, ProjectSDG
from teams.models import StudentTeam
from teams.serializers import TeamMemberSerializer  # Import from teams app
from users.models import User
from engagement.models import Leaderboard, Feedback

class SDGSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDG
        fields = ['sdg_id', 'sdg_number', 'sdg_name']

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

class ProjectDetailSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.team_name')
    team_members = serializers.SerializerMethodField()
    sdgs = SDGSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    created_year = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'project_id', 
            'title',
            'description',
            'features',
            'category',
            'github_link',
            'media_link',
            'thumbnail_url',
            'created_at',
            'created_year',
            'team_name',
            'team_members',
            'sdgs',
            'average_rating',
            'total_ratings',
            'comments'
        ]
    
    def get_team_members(self, obj):
        team_members = TeamMember.objects.filter(team=obj.team).select_related('user')
        return TeamMemberSerializer(team_members, many=True).data
    
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
    
    def get_comments(self, obj):
        comments = Feedback.objects.filter(project=obj).select_related('user').order_by('-created_at')
        return [{
            'id': comment.feedback_id,
            'text': comment.comment,
            'user_name': comment.user.full_name if comment.user else 'Anonymous',
            'created_at': comment.created_at,
            'rating': comment.rating
        } for comment in comments]
    
    def get_created_year(self, obj):
        return obj.created_at.year

    def get_features(self, obj):
        return obj.get_features()

class CategorySerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField()

class RatingRangeSerializer(serializers.Serializer):
    range = serializers.CharField()
    count = serializers.IntegerField()
    min_rating = serializers.FloatField()
    max_rating = serializers.FloatField() 