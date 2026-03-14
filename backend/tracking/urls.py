from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemLedgerViewSet, ItemViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='items')
router.register(r'ledger', ItemLedgerViewSet, basename='ledger')

urlpatterns = [
    path('', include(router.urls)),
]