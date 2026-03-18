from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, filters
from .models import Item, ItemLedger
from .serializers import ItemSerializer, ItemLedgerSerializer
from django.db import transaction

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all() # gets all items in the DB
    serializer_class = ItemSerializer 

    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class ItemLedgerViewSet(viewsets.ModelViewSet):
    queryset = ItemLedger.objects.all().order_by("-occurred_at", "-recorded_at")
    serializer_class = ItemLedgerSerializer

    def perform_create(self, serializer):
        with transaction.atomic(): # database transaction
            item = Item.objects.select_for_update().get(pk=serializer.validated_data["item"].pk)
            
            
            delta = serializer.validated_data["delta"]
            new_count = item.count + delta

            if new_count < 0:
                raise ValidationError("Inventory cannot go below zero.")

            serializer.save(item=item)
            item.count = new_count
            item.save()




