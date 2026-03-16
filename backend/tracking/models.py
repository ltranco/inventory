from django.db import models

class Items(models.Model):
    name = models.CharField(max_length = 250, unique=True)
    qty = models.IntegerField()

    def __str__(self):
        return self.name

class ItemsLedger(models.Model):
    item = models.ForeignKey(Items, on_delete=models.CASCADE)
    delta = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

#inheritance 