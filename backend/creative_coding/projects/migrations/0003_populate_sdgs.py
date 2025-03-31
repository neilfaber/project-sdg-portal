from django.db import migrations

def populate_sdgs(apps, schema_editor):
    SDG = apps.get_model('projects', 'SDG')
    
    sdgs_data = [
        (1, "No Poverty"),
        (2, "Zero Hunger"),
        (3, "Good Health and Well-being"),
        (4, "Quality Education"),
        (5, "Gender Equality"),
        (6, "Clean Water and Sanitation"),
        (7, "Affordable and Clean Energy"),
        (8, "Decent Work and Economic Growth"),
        (9, "Industry, Innovation and Infrastructure"),
        (10, "Reduced Inequalities"),
        (11, "Sustainable Cities and Communities"),
        (12, "Responsible Consumption and Production"),
        (13, "Climate Action"),
        (14, "Life Below Water"),
        (15, "Life on Land"),
        (16, "Peace, Justice and Strong Institutions"),
        (17, "Partnerships for the Goals"),
    ]
    
    for number, name in sdgs_data:
        SDG.objects.create(sdg_number=number, sdg_name=name)

def reverse_populate_sdgs(apps, schema_editor):
    SDG = apps.get_model('projects', 'SDG')
    SDG.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('projects', '0002_initial'),  # Points to your previous migration
    ]

    operations = [
        migrations.RunPython(populate_sdgs, reverse_populate_sdgs),
    ] 