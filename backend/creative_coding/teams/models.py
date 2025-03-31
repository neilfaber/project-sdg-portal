from django.db import models
from users.models import User

# Create your models here.
class StudentTeam(models.Model):
    team_id = models.AutoField(primary_key=True)
    team_name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_teams')
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, through='TeamMember', related_name='teams')

    class Meta:
        db_table = 'student_teams'

    def __str__(self):
        return self.team_name


class TeamMember(models.Model):
    team = models.ForeignKey(StudentTeam, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'team_members'
        unique_together = ('team', 'user')  # Composite primary key

    def __str__(self):
        return f"{self.user.full_name} - {self.team.team_name}"


class MentorshipRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    request_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_requests_sent')
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_requests_received')
    # Use string reference to avoid circular imports
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='mentorship_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    request_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mentorship_requests'

    def __str__(self):
        return f"Request from {self.student.full_name} to {self.faculty.full_name}"
