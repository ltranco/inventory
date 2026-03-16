from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Items, ItemsLedger
from .serializers import ItemSerializer, LedgerSerializer

class ItemViewSet(ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemSerializer

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
 
    filterset_fields = ["name", "qty"]

    search_fields = ["name"]
   
    ordering_fields = ["name", "qty"]
    ordering = ["id"] 

    def perform_create(self, serializer):
        item = serializer.save()

        ItemsLedger.objects.create(
            item=item,
            delta=item.qty,
            
        )

    def perform_update(self, serializer):
        old_item = self.get_object()
        old_qty = old_item.qty

        updated_item = serializer.save()
        new_qty = updated_item.qty
        delta = new_qty - old_qty

        if delta != 0:
            ItemsLedger.objects.create(
                item=updated_item,
                delta=delta,
            )

    def perform_destroy(self, instance):
        ItemsLedger.objects.create(
            item=instance,
            delta=-instance.qty,
        )
        instance.delete() 

class ItemsLedgerViewSet(ModelViewSet):
    queryset = ItemsLedger.objects.all().order_by("-created_at")
    serializer_class = LedgerSerializer