from django.db import models
import json

class SDG(models.Model):
    sdg_id = models.AutoField(primary_key=True)
    sdg_number = models.IntegerField(unique=True)
    sdg_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'sdgs'
        ordering = ['sdg_number']

    def __str__(self):
        return f"SDG {self.sdg_number}: {self.sdg_name}"

class ProjectSDG(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    sdg = models.ForeignKey(SDG, on_delete=models.CASCADE)

    class Meta:
        db_table = 'project_sdgs'
        unique_together = ('project', 'sdg')

    def __str__(self):
        return f"{self.project.title} - {self.sdg}"

# Create your models here.
class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Games', 'Games'),
        ('Animations', 'Animations'),
        ('Web Applications', 'Web Applications'),
        ('Mobile Apps', 'Mobile Apps'),
        ('Digital Art', 'Digital Art'),
        ('Videos', 'Videos'),
        ('Documentaries', 'Documentaries'),
        ('Data Visualizations', 'Data Visualizations'),
    ]
    
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    SDG_CHOICES = [
        (1, 'No Poverty'),
        (2, 'Zero Hunger'),
        (3, 'Good Health and Well-being'),
        (4, 'Quality Education'),
        (5, 'Gender Equality'),
        (6, 'Clean Water and Sanitation'),
        (7, 'Affordable and Clean Energy'),
        (8, 'Decent Work and Economic Growth'),
        (9, 'Industry, Innovation and Infrastructure'),
        (10, 'Reduced Inequalities'),
        (11, 'Sustainable Cities and Communities'),
        (12, 'Responsible Consumption and Production'),
        (13, 'Climate Action'),
        (14, 'Life Below Water'),
        (15, 'Life on Land'),
        (16, 'Peace, Justice and Strong Institutions'),
        (17, 'Partnerships for the Goals'),
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
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    sdgs = models.ManyToManyField(SDG, through='ProjectSDG', related_name='projects')

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

    def get_sdgs(self):
        """Returns a list of SDG dictionaries with number and name"""
        return [
            {'sdg_number': sdg.sdg_number, 'sdg_name': sdg.sdg_name}
            for sdg in self.sdgs.all()
        ]

    def set_sdgs(self, sdg_numbers):
        """Set SDGs using a list of SDG numbers (1-17)"""
        valid_sdgs = [num for num in sdg_numbers if num in dict(self.SDG_CHOICES)]
        self.sdgs.clear()
        for num in valid_sdgs:
            sdg, created = SDG.objects.get_or_create(sdg_number=num)
            self.sdgs.add(sdg)

