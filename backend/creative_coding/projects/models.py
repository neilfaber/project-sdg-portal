from django.db import models

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

    project_id = models.AutoField(primary_key=True)
    # Use string reference for the model to avoid circular imports
    team = models.ForeignKey('teams.StudentTeam', on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    github_link = models.CharField(max_length=255, blank=True, null=True)
    media_link = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='project_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'

    def __str__(self):
        return self.title


class SDG(models.Model):
    sdg_id = models.AutoField(primary_key=True)
    sdg_name = models.CharField(max_length=255, unique=True)
    # Many-to-many relationship with projects, through ProjectSDG
    projects = models.ManyToManyField(Project, through='ProjectSDG', related_name='sdgs')

    class Meta:
        db_table = 'sdgs'

    def __str__(self):
        return self.sdg_name


class ProjectSDG(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, to_field='project_id')
    sdg = models.ForeignKey(SDG, on_delete=models.CASCADE, to_field='sdg_id')

    class Meta:
        db_table = 'project_sdgs'
        # Define composite primary key
        unique_together = ('project', 'sdg')
    
    def __str__(self):
        return f"{self.project.title} - {self.sdg.sdg_name}"



