from django.db import models
from django.utils import timezone

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=255, unique=True)
    count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    # PRIORITY
    # how can we add timestamps to the model
    # when things are added or removed

    # hint: ledger
    # tallys at the end and reveals at the end

    # would have to create a new model completely
    # UI doesnt change at all yet


class ItemLedger(models.Model):

    item = models.ForeignKey(
        "Item",
        on_delete=models.CASCADE,
        related_name="ledger_entries", # basically this: coffee.ledger_entries.all()
    ) 
    # ensures that each ledger entry belongs to one item and when one item is deleted 

    delta = models.IntegerField()

    occurred_at = models.DateTimeField(default=timezone.now)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        sign = "+" if self.delta >= 0 else ""
        return f"{self.item.name}: {sign}{self.delta} @ {self.occurred_at}"
