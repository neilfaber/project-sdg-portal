"""
Script to manually assign a faculty member to a team.
Usage: python manage.py shell -c "exec(open('tools/assign_teacher.py').read())"
"""
import os
import sys
import django

# Add the project path to system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'creative_coding.settings')
django.setup()

from users.models import User
from teams.models import StudentTeam, TeamMember

def assign_teacher_to_team(teacher_email, team_id):
    try:
        # Find the teacher
        teacher = User.objects.get(email=teacher_email, role='faculty')
        
        # Find the team
        team = StudentTeam.objects.get(team_id=team_id)
        
        # Check if the teacher is already a member
        if TeamMember.objects.filter(team=team, user=teacher).exists():
            print(f"Teacher {teacher.full_name} is already a member of team {team.team_name}")
            return
            
        # Add teacher to team
        TeamMember.objects.create(team=team, user=teacher)
        print(f"Successfully added {teacher.full_name} to team {team.team_name}")
        
    except User.DoesNotExist:
        print(f"No faculty member found with email {teacher_email}")
    except StudentTeam.DoesNotExist:
        print(f"No team found with ID {team_id}")
    except Exception as e:
        print(f"Error: {str(e)}")

def list_teachers():
    teachers = User.objects.filter(role='faculty')
    if not teachers:
        print("No faculty members found")
        return
    
    print("Available teachers:")
    for teacher in teachers:
        print(f"ID: {teacher.id}, Email: {teacher.email}, Name: {teacher.full_name}")

def list_teams():
    teams = StudentTeam.objects.all()
    if not teams:
        print("No teams found")
        return
    
    print("Available teams:")
    for team in teams:
        print(f"ID: {team.team_id}, Name: {team.team_name}")

# List available teachers and teams
print("==== LISTING AVAILABLE TEACHERS AND TEAMS ====")
list_teachers()
print("\n")
list_teams()

# Update these values for your specific case:
teacher_email = "teacher1@gmail.com"  # Replace with your teacher's email
team_id = 1  # Replace with an actual team ID

print("\n==== ASSIGNING TEACHER TO TEAM ====")
print(f"Attempting to assign teacher {teacher_email} to team {team_id}")
assign_teacher_to_team(teacher_email, team_id) 