from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    cover = models.ImageField(upload_to='covers/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    link = models.URLField(max_length=200, blank=True, null=True)
    followers = models.ManyToManyField(User, related_name='followed_by', blank=True)  
    following = models.ManyToManyField(User, related_name='following', blank=True)    

    def __str__(self):
        return self.user.username


class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tweets')
    text = models.TextField(max_length=280)
    image = models.ImageField(upload_to='tweets/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_tweets', blank=True)
    likeCount = models.IntegerField(default=0)
    liked = models.BooleanField(default=False)
    retweets = models.ManyToManyField(User, related_name='retweeted_tweets', blank=True)
    comments = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='commented_on')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.text[:50]}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        base_slug = slugify(instance.username)
        slug = base_slug
        counter = 1
        while Profile.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        Profile.objects.create(user=instance, slug=slug)