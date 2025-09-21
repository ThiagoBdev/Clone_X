from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer, TweetSerializer
from .models import Tweet, Profile
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not all([username, email, password]):
            return Response({'error': 'Todos os campos são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Nome de usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email já cadastrado.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['patch'], url_path='me/update-profile', permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        # Extrair dados do profile manualmente
        profile_data = {}
        for key, value in request.data.items():
            if key.startswith('profile.'):
                nested_key = key.replace('profile.', '', 1)  # Remove o prefixo 'profile.'
                profile_data[nested_key] = value
        # Atualizar request.data com os dados do profile
        request_data = request.data.copy()
        if profile_data:
            request_data['profile'] = profile_data
        
        serializer = self.get_serializer(user, data=request_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print("Erros de validação:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='tweets')
    def get_user_tweets(self, request, pk=None):
        try:
            user = self.get_object()
            tweets = Tweet.objects.filter(user=user)
            serializer = TweetSerializer(tweets, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, pk=None):  
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='slug/(?P<slug>[^/.]+)')
    def get_user_by_slug(self, request, slug=None):
        try:
            profile = Profile.objects.get(slug=slug)
            serializer = self.get_serializer(profile.user)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recommendations')
    def recommendations(self, request):
        current_user_id = request.user.id
        exclude_id = request.query_params.get('exclude')
        limit = int(request.query_params.get('limit', 5))
        queryset = User.objects.exclude(id=exclude_id or current_user_id).order_by('?')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='followers-count', permission_classes=[IsAuthenticated])
    def followers_count(self, request, pk=None):
        user = self.get_object()
        profile = user.profile
        followers_count = profile.followers.count()  
        following_count = profile.following.count()  
        return Response({
            'followers_count': followers_count,
            'following_count': following_count
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='follow', permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        target_user = self.get_object()
        current_user = request.user
        if current_user.id == target_user.id:
            return Response({'error': 'Você não pode seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = current_user.profile
        if target_user.profile in profile.following.all():
            profile.following.remove(target_user)
            return Response({'message': 'Usuário deixado de seguir.', 'following': False}, status=status.HTTP_200_OK)
        else:
            profile.following.add(target_user)
            return Response({'message': 'Usuário seguido com sucesso.', 'following': True}, status=status.HTTP_200_OK)

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        tweet = self.get_object()
        comment_text = request.data.get('text')
        if comment_text:
            comment = Tweet.objects.create(user=request.user, text=comment_text)
            tweet.comments.add(comment)
            return Response({'message': 'Commented'}, status=status.HTTP_200_OK)
        return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        tweet = self.get_object()
        tweet.likeCount += 1
        tweet.liked = True
        tweet.save()
        return Response({'message': 'Tweet curtido'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        tweet = self.get_object()
        if tweet.likeCount > 0:
            tweet.likeCount -= 1
        tweet.liked = False
        tweet.save()
        return Response({'message': 'Tweet descurtido'}, status=status.HTTP_200_OK)

class UserRecommendationsView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_user_id = self.request.user.id
        exclude_id = self.request.query_params.get('exclude')
        limit = self.request.query_params.get('limit', 5)
        queryset = User.objects.exclude(id=exclude_id or current_user_id).order_by('?')[:int(limit)]
        return queryset