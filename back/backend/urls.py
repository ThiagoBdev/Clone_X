from django.contrib import admin
from django.urls import path, include
from django.views.static import serve  
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserViewSet, TweetViewSet
from django.conf import settings

router = DefaultRouter()
router.register(r'users', UserViewSet)  
router.register(r'tweets', TweetViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),  
]