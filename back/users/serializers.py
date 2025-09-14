from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet, Profile, Follow

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['slug', 'avatar', 'cover', 'bio', 'link']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    retweets_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    retweeted = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text', 'image', 'created_at', 'likes_count', 'retweets_count', 'comment_count', 'liked', 'retweeted']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_retweets_count(self, obj):
        return obj.retweets.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_liked(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj.likes.filter(id=request.user.id).exists()

    def get_retweeted(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj.retweets.filter(id=request.user.id).exists()