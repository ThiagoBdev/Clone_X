from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserViewSet, TweetViewSet
from django.conf import settings

# Router da API
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tweets', TweetViewSet)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API endpoints via router
    path('api/', include(router.urls)),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rotas do app users fora do router (ex: register)
    path('users/', include('users.urls')),

    # Media
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
]
