from django.db import models

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"{self.title} - {self.start_time.date()}"