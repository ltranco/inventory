# from django.urls import path
# from .views import ItemsView

# urlpatterns = [
    
#     path("items/", ItemsView.as_view(), name="items"),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemsLedgerViewSet

router = DefaultRouter()
router.register(r"items", ItemViewSet, basename="items")
router.register(r"ledger", ItemsLedgerViewSet, basename="ledger")

urlpatterns = [
    path("", include(router.urls)),
]