from django.db import models
from django.core.validators import MinValueValidator

class Menu(models.Model):
    name = models.CharField(max_length=50, null=False)
    description = models.TextField(
        null=True
    )
    price = models.DecimalField(
        null=False,
        max_digits=6,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f'{self.name}'


class Order(models.Model):
    STATUSES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    )
    status = models.CharField(
        default='pending',
        max_length=50,
        choices=STATUSES
    )
    
    def order_total(self):
        return self.order_items.aggregate(
            total = models.Sum(
                models.F('item__price') * models.F('quantity')
            )
        )['total']


class OrderItem(models.Model):
    quantity = models.PositiveIntegerField(
        null=False,
        validators=[
            MinValueValidator(1)
        ]
    )
    description = models.TextField(
        null=True
    )
    order = models.ForeignKey(
        Order,
        related_name='order_items',
        on_delete=models.CASCADE
    )
    item = models.ForeignKey(
        Menu,
        related_name='order',
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = [
            'item', 'order'
        ]
