from rest_framework import serializers
from .models import Item, ItemLedger

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'count'] 
        read_only_fields = ['count'] 
        # creates a helpful json response
        # deserializing turns the json back to python


    # POST - moved the validator logic from views to here, less manual and more reusable
    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name is required.")
        if Item.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Item with this name already exists.")
        return value
    
    # PATCH - count validator
    def validate_count(self, value):
        if value < 0:
            raise serializers.ValidationError("Count cannot be negative.")
        return value
    

class ItemLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemLedger
        fields = ['id', 'item', 'delta', 'occurred_at', 'recorded_at']
        read_only_fields = ['id', 'recorded_at']
        







    # look into what happens if we have nested objects, an item has a memo/note
    # the note is another object in another table
    # how would you serialize that?

    # what if you want to change the return format, make it more fancy, 
    # or have extra fields the model currently doesnt have
    
    # using the serializer to change the format of the db