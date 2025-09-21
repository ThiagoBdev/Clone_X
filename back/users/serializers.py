from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet, Profile

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)
    cover = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = ['slug', 'avatar', 'cover', 'bio', 'link']

    def update(self, instance, validated_data):
        bio = validated_data.get('bio', instance.bio)
        print(f"Atualizando bio: {bio} (tipo: {type(bio)})")  # Debug
        instance.bio = bio
        instance.link = validated_data.get('link', instance.link)
        request = self.context.get('request')
        if request and request.FILES:
            if 'profile.avatar' in request.FILES:  # Ajustado para prefixo
                instance.avatar = request.FILES['profile.avatar']
            if 'profile.cover' in request.FILES:  # Ajustado para prefixo
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
            representation['profile']['bio'] = str(representation['profile'].get('bio') or '')  # Corrige None para ''
            representation['profile']['link'] = str(representation['profile'].get('link') or '')  # Corrige None para ''
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