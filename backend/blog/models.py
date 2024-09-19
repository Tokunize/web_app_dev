from django.db import models
from django.db.models import F
from django.utils import timezone

class Article(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True)
    subtitle = models.TextField(null=True, blank=True)
    first_section = models.TextField()
    day_posted = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    image_urls = models.JSONField(default=list, blank=True)
    second_section = models.TextField(null=True, blank=True)
    third_section = models.TextField(null=True, blank=True)
    fourth_section = models.TextField(null=True, blank=True)
    five_section = models.TextField(null=True, blank=True)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-day_posted']
        indexes = [
            models.Index(fields=['-day_posted'])
        ]

class DailyVisit(models.Model):
    date = models.DateField(unique=True)
    visits = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.date}: {self.visits} visits"

    @classmethod
    def increment_visits(cls):
        today = timezone.now().date()
        obj, created = cls.objects.get_or_create(date=today)
        obj.visits = F('visits') + 1
        obj.save()


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-subscribed_at']
        indexes = [
            models.Index(fields=['email'])
        ]