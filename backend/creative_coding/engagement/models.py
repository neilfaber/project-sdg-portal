from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from projects.models import Project

# Create your models here.
class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification to {self.user.full_name}: {self.message[:30]}..."


class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ('participation', 'Participation'),
        ('SDG impact', 'SDG Impact'),
        ('engagement', 'Engagement'),
    ]

    report_id = models.AutoField(primary_key=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='generated_reports')
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    report_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_type} Report by {self.generated_by.full_name if self.generated_by else 'Unknown'}"


class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='given_feedback')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback on {self.project.title} by {self.user.full_name if self.user else 'Anonymous'}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update leaderboard entry after saving feedback
        self._update_leaderboard()

    def _update_leaderboard(self):
        """Update the leaderboard entry for this project after feedback is saved."""
        from django.db.models import Avg, Count
        
        # Get aggregated feedback data
        feedback_stats = Feedback.objects.filter(project=self.project).aggregate(
            total=Count('feedback_id'),
            avg=Avg('rating')
        )
        
        # Update or create leaderboard entry
        Leaderboard.objects.update_or_create(
            project=self.project,
            defaults={
                'total_ratings': feedback_stats['total'],
                'average_rating': feedback_stats['avg'] or 0.0
            }
        )


class Leaderboard(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, primary_key=True, related_name='leaderboard_entry')
    total_ratings = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'leaderboard'
        ordering = ['-average_rating', '-total_ratings']

    def __str__(self):
        return f"{self.project.title}: {self.average_rating} ({self.total_ratings} ratings)"
