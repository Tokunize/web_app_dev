from django.db import models

class Article(models.Model):
  
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True)  
    subtitle = models.TextField(null=True, blank=True)
    first_section = models.TextField()
    day_posted = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    image_urls = models.JSONField(default=list, blank=True) 
    second_section = models.TextField(null = True, blank = True)
    third_section = models.TextField(null = True, blank = True)

    def __str__(self):
        return self.title
    
    class Meta():
        ordering = ['-day_posted']
        indexes = [
            models.Index(fields=['-day_posted'])
        ]