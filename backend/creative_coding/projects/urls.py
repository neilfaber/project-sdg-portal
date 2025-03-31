from django.urls import path
from .views import ProjectListView, CategoryListView, SDGListView, ProjectDetailView

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('sdgs/', SDGListView.as_view(), name='sdg-list'),
    path('projects/<int:project_id>/', ProjectDetailView.as_view(), name='project-detail'),
] 