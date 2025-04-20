from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectListView, CategoryListView, SDGListView,
    ProjectDetailView, RatingRangeListView,
    ProjectSubmissionView, AdminProjectViewSet,
    UserProjectsView, RejectedProjectsView,
    FeedbackCreateView
)

router = DefaultRouter()
router.register(r'admin/projects', AdminProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/submit/', ProjectSubmissionView.as_view(), name='project-submit'),
    path('projects/<int:project_id>/', ProjectDetailView.as_view(), name='project-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('sdgs/', SDGListView.as_view(), name='sdg-list'),
    path('rating-ranges/', RatingRangeListView.as_view(), name='rating-ranges'),
    path('user-projects/', UserProjectsView.as_view(), name='user-projects'),
    path('admin/rejected/', RejectedProjectsView.as_view(), name='rejected-projects'),
    path('feedback/', FeedbackCreateView.as_view(), name='create-feedback'),
    path('admin/projects/<int:pk>/', AdminProjectViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update'
    }), name='admin-project-detail'),
    path('admin/projects/<int:pk>/approve/', AdminProjectViewSet.as_view({'post': 'approve'}), name='admin-project-approve'),
    path('admin/projects/<int:pk>/reject/', AdminProjectViewSet.as_view({'post': 'reject'}), name='admin-project-reject'),
    path('admin/projects/<int:pk>/assign_teacher/', AdminProjectViewSet.as_view({'post': 'assign_teacher'}), name='admin-project-assign-teacher'),
] 