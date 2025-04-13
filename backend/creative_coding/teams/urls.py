from django.urls import path
from .views import StudentTeamViewSet, MentorshipRequestViewSet

urlpatterns = [
    # Team endpoints
    path('teams/', StudentTeamViewSet.as_view({'get': 'list', 'post': 'create'}), name='team-list'),
    path('teams/<int:pk>/', StudentTeamViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='team-detail'),
    path('teams/<int:pk>/add_member/', StudentTeamViewSet.as_view({'post': 'add_member'}), name='team-add-member'),
    path('teams/<int:pk>/remove_member/', StudentTeamViewSet.as_view({'delete': 'remove_member'}), name='team-remove-member'),
    path('teams/<int:pk>/members/', StudentTeamViewSet.as_view({'get': 'members'}), name='team-members'),

    # Mentorship request endpoints
    path('mentorship-requests/', MentorshipRequestViewSet.as_view({'get': 'list', 'post': 'create'}), name='mentorship-request-list'),
    path('mentorship-requests/<int:pk>/', MentorshipRequestViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='mentorship-request-detail'),
    path('mentorship-requests/<int:pk>/approve/', MentorshipRequestViewSet.as_view({'post': 'approve'}), name='mentorship-request-approve'),
    path('mentorship-requests/<int:pk>/reject/', MentorshipRequestViewSet.as_view({'post': 'reject'}), name='mentorship-request-reject'),
] 