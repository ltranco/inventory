from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=255, unique=True)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.count})"
    
    def add_count(self, amount):
        self.count += amount
        self.save()

    def remove_count(self, amount):
        if amount > self.count:
            raise ValueError("Not enough items in count")
        self.count -= amount
        self.save()