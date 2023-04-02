from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    def __str__(self):
        return self.username


class Pet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=42)
    thirst = models.IntegerField(default=0)
    happiness = models.IntegerField(default=10)
    hunger = models.IntegerField(default=0)
    last_save = models.CharField(blank=True, max_length=42)
    birth_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'user': self.user.username,
            'name': self.name,
            'thirst': self.thirst,
            'happiness': self.happiness,
            'hunger': self.hunger,
            'last_save': self.last_save,
            'birth_date': self.birth_date,
        }

