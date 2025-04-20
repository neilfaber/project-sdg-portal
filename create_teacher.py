"""
Script to create a new teacher/faculty user in the system.
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
from django.db import transaction

User = get_user_model()

# Create a new teacher/faculty user
def create_teacher(username, email, full_name, password):
    try:
        with transaction.atomic():
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                print(f"User '{username}' already exists.")
                return
            
            if User.objects.filter(email=email).exists():
                print(f"User with email '{email}' already exists.")
                return
            
            # Create new teacher user
            teacher = User.objects.create_user(
                username=username,
                email=email,
                full_name=full_name,
                password=password,
                role='faculty',  # Use 'faculty' as that's the frontend's expectation
                status='active'
            )
            
            print(f"Teacher '{full_name}' created successfully!")
            print(f"Username: {username}")
            print(f"Email: {email}")
            print(f"Role: {teacher.role}")
            
            # Check current users
            print("\nCurrent users in the system:")
            users = User.objects.all()
            print(f"Total users: {users.count()}")
            
            for i, user in enumerate(users, start=1):
                print(f"{i}. {user.full_name} ({user.role}) - {user.email}")
            
    except Exception as e:
        print(f"Error creating teacher: {e}")

if __name__ == "__main__":
    # You can change these values or accept them as command line arguments
    username = "teacher123"
    email = "teacher123@example.com"
    full_name = "Test Teacher"
    password = "password123"
    
    if len(sys.argv) >= 5:
        username = sys.argv[1]
        email = sys.argv[2]
        full_name = sys.argv[3]
        password = sys.argv[4]
    
    print(f"Creating teacher user: {full_name} ({email})")
    create_teacher(username, email, full_name, password) 