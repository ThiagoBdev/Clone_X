from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet, Profile

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_empty_file=True, allow_null=True)
    cover = serializers.ImageField(required=False, allow_empty_file=True, allow_null=True)

    class Meta:
        model = Profile
        fields = ['slug', 'avatar', 'cover', 'bio', 'link']

    def update(self, instance, validated_data):
        instance.bio = validated_data.get('bio', instance.bio)
        instance.link = validated_data.get('link', instance.link)
        
        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            if 'avatar' in request.FILES:
                instance.avatar = request.FILES.get('avatar')
            if 'cover' in request.FILES:
                instance.cover = request.FILES.get('cover')
        
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        if validated_data.get('password'):
            instance.set_password(validated_data.get('password'))
        instance.save()

        profile, created = Profile.objects.get_or_create(user=instance)
        
        profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True, context={'request': self.context.get('request')})
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            raise serializers.ValidationError(profile_serializer.errors)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['first_name'] = str(representation.get('first_name', ''))
        representation['last_name'] = str(representation.get('last_name', ''))
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