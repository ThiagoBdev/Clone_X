@action(detail=True, methods=['post'])
def comment(self, request, pk=None):
    tweet = self.get_object()
    comment_text = request.data.get('text')
    if comment_text:
        comment = Tweet.objects.create(user=request.user, text=comment_text)
        tweet.comments.add(comment)
        return Response({'message': 'Commented'}, status=status.HTTP_200_OK)
    return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)