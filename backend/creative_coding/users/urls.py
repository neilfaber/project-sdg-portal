from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignupView, CustomTokenObtainPairView, UserProfileView, AdminUserViewSet, ListUsersView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('students/', ListUsersView.as_view(), name='list-students'),
] 