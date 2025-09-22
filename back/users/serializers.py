from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet, Profile, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # Campo personalizado para o usuário
    tweet = serializers.PrimaryKeyRelatedField(read_only=True)  # Link para o tweet

    class Meta:
        model = Comment
        fields = ['id', 'tweet', 'user', 'text', 'created_at']

    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'slug': obj.user.profile.slug if obj.user.profile else None
        }

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)
    cover = serializers.ImageField(required=False, allow_null=True)
    following = serializers.SerializerMethodField()
    followers_count = serializers.IntegerField(source='followed_by.count', read_only=True)

    class Meta:
        model = Profile
        fields = ['slug', 'avatar', 'cover', 'bio', 'link', 'following', 'followers_count']

    def get_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.following.filter(id=request.user.id).exists()
        return False

    def update(self, instance, validated_data):
        bio = validated_data.get('bio', instance.bio)
        print(f"Atualizando bio: {bio} (tipo: {type(bio)})")
        instance.bio = bio
        instance.link = validated_data.get('link', instance.link)
        request = self.context.get('request')
        if request and request.FILES:
            if 'profile.avatar' in request.FILES:
                instance.avatar = request.FILES['profile.avatar']
            if 'profile.cover' in request.FILES:
                instance.cover = request.FILES['profile.cover']
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False, partial=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
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
            representation['profile']['bio'] = str(representation['profile'].get('bio') or '')
            representation['profile']['link'] = str(representation['profile'].get('link') or '')
        else:
            representation['profile'] = {'bio': '', 'link': ''}
        if hasattr(instance, 'profile') and instance.profile:
            representation['profile']['following'] = [user.id for user in instance.profile.following.all()]
        return representation

class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    retweets_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    retweeted = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text', 'image', 'created_at', 'likes_count', 'retweets_count', 'comment_count', 'liked', 'retweeted', 'comments']

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