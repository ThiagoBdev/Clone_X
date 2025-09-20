from django.urls import path
from . import views

urlpatterns = [
    path('recommendations/', views.UserRecommendationsView.as_view(), name='user_recommendations'),
]