from django.urls import path
from .views import ItemsView

urlpatterns = [
    path('items/', ItemsView.as_view()),
    path('items/<int:item_id>/', ItemsView.as_view()),
]