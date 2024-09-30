from rest_framework import serializers
from .models import Item, CartItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','title', 'description', 'price', 'date_added']
class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()  # Nested serializer to include item details.

    class Meta:
        model = CartItem
        fields = ['item']  # Include other fields if necessary.
