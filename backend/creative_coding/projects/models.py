from django.db import models
import json

# Create your models here.
class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Animation', 'Animation'),
        ('Game', 'Game'),
        ('Web Development', 'Web Development'),
        ('Video', 'Video'),
        ('Documentary', 'Documentary'),
        ('Creative Art', 'Creative Art'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    project_id = models.AutoField(primary_key=True)
    # Use string reference for the model to avoid circular imports
    team = models.ForeignKey('teams.StudentTeam', on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    features = models.TextField(blank=True, null=True, help_text="List of project features as bullet points (stored as JSON)")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    github_link = models.CharField(max_length=255, blank=True, null=True)
    media_link = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='project_thumbnails/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.title

    def set_features(self, features_list):
        self.features = json.dumps(features_list)

    def get_features(self):
        if self.features:
            return json.loads(self.features)
        return []


class SDG(models.Model):
    sdg_id = models.AutoField(primary_key=True)
    sdg_number = models.IntegerField(unique=True)  # Adding SDG number (1-17)
    sdg_name = models.CharField(max_length=255, unique=True)
    # Many-to-many relationship with projects, through ProjectSDG
    projects = models.ManyToManyField(Project, through='ProjectSDG', related_name='sdgs')

    class Meta:
        db_table = 'sdgs'
        ordering = ['sdg_number']  # Order by SDG number

    def __str__(self):
        return f"SDG {self.sdg_number}: {self.sdg_name}"


class ProjectSDG(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, to_field='project_id')
    sdg = models.ForeignKey(SDG, on_delete=models.CASCADE, to_field='sdg_id')

    class Meta:
        db_table = 'project_sdgs'
        # Define composite primary key
        unique_together = ('project', 'sdg')
    
    def __str__(self):
        return f"{self.project.title} - {self.sdg.sdg_name}"



