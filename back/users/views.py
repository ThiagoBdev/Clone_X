from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer, TweetSerializer  # Adicione TweetSerializer se necessário
from .models import Tweet  # Importe o modelo Tweet

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Validações básicas
        if not all([username, email, password]):
            return Response({'error': 'Todos os campos são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Nome de usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email já cadastrado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Cria o usuário
        user = User.objects.create_user(username=username, email=email, password=password)
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer  # Ajuste conforme necessário

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        tweet = self.get_object()
        comment_text = request.data.get('text')
        if comment_text:
            comment = Tweet.objects.create(user=request.user, text=comment_text)
            tweet.comments.add(comment)
            return Response({'message': 'Commented'}, status=status.HTTP_200_OK)
        return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)