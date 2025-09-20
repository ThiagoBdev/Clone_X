from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['slug', 'avatar', 'cover', 'bio', 'link']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        # Atualizar senha, se fornecida
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()

        # Atualizar perfil
        profile = instance.profile
        profile.avatar = profile_data.get('avatar', profile.avatar)
        profile.cover = profile_data.get('cover', profile.cover)
        profile.bio = profile_data.get('bio', profile.bio)
        profile.link = profile_data.get('link', profile.link)
        profile.save()

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Garantir que first_name e last_name sejam strings
        representation['first_name'] = str(representation.get('first_name', ''))
        representation['last_name'] = str(representation.get('last_name', ''))
        # Garantir que os campos do profile sejam strings, se aplicável
        if 'profile' in representation:
            representation['profile']['bio'] = str(representation['profile'].get('bio', ''))
            representation['profile']['link'] = str(representation['profile'].get('link', ''))
        return representation

class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    retweets_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    retweeted = serializers.SerializerMethodField()  # Corrigido de SerialMethodField para SerializerMethodField

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