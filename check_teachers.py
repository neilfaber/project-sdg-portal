"""
Script to check for existing teacher/faculty users in the system.
Run this from the root directory of the project.
"""
import os
import sys
import django

# Set up Django environment
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'creative_coding.settings')
django.setup()

# Import Django models
from django.contrib.auth import get_user_model

User = get_user_model()

def check_users():
    # Get all users
    all_users = User.objects.all()
    print(f"Total users in the system: {all_users.count()}")
    
    # Check for users with role 'faculty' or 'teacher'
    faculty_users = User.objects.filter(role='faculty')
    teacher_users = User.objects.filter(role='teacher')
    
    print(f"\nUsers with role 'faculty': {faculty_users.count()}")
    for i, user in enumerate(faculty_users, start=1):
        print(f"{i}. {user.full_name} ({user.username}) - {user.email} - Status: {user.status}")
    
    print(f"\nUsers with role 'teacher': {teacher_users.count()}")
    for i, user in enumerate(teacher_users, start=1):
        print(f"{i}. {user.full_name} ({user.username}) - {user.email} - Status: {user.status}")
    
    # Check roles that exist in the system
    roles = User.objects.values_list('role', flat=True).distinct()
    print(f"\nRoles that exist in the system: {list(roles)}")
    
    # Count users by role
    print("\nUsers by role:")
    for role in roles:
        count = User.objects.filter(role=role).count()
        print(f"- {role}: {count} users")

if __name__ == "__main__":
    print("Checking for teacher/faculty users in the system...")
    check_users() 