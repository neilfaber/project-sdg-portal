from rest_framework import serializers
from .models import Feedback, Leaderboard
from users.serializers import UserSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['feedback_id', 'project', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['feedback_id', 'created_at']

    def create(self, validated_data):
        # Get the user from the context
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['project', 'total_ratings', 'average_rating']
        read_only_fields = ['total_ratings', 'average_rating'] 