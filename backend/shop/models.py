from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Item(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)  # Title of the item
    description = models.TextField()  # Description of the item
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price of the item
    date_added = models.DateTimeField(default=timezone.now)  # Date when the item was added

    def __str__(self):
        return self.title

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"{self.user.username}'s Cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)  # Assuming Item is already defined

    def __str__(self):
        return f"{self.item.title} in {self.cart.user.username}'s Cart"
