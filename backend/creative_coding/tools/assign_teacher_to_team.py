#!/usr/bin/env python
"""
Script to manually assign a faculty member to a team.
Usage: python manage.py shell < tools/assign_teacher_to_team.py
"""

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

# Update these values for your specific case:
teacher_email = "teacher1@gmail.com"  # Replace with your teacher's email
team_id = 1  # Replace with an actual team ID

# Run the function
print(f"Attempting to assign teacher {teacher_email} to team {team_id}")
assign_teacher_to_team(teacher_email, team_id) 