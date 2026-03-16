# serializers.py
from rest_framework import serializers
from .models import Items, ItemsLedger

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Items
        fields = ['id', 'name', 'qty']

class LedgerSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemsLedger
        fields = ['item', 'delta', 'qty_after', 'created_at']