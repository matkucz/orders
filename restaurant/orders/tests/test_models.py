from django.test import TestCase
from django.core.exceptions import ValidationError

from orders.models import Menu, Order, OrderItem


class MenuTestCase(TestCase):
    def test_create(self):
        item = Menu(
            name = 'Pad thai',
            price=20.99
        )
        item.save()
        self.assertEqual(item.description, None)

    def test_price_field(self):
        item = Menu(
            name = 'Pad thai',
            price=19.233
        )
        with self.assertRaises(ValidationError) as context:
            item.price = 19.233
            item.full_clean()
        self.assertTrue(
            'Ensure that there are no more than 2 decimal places.'
            in 
            str(context.exception)
        )

        with self.assertRaises(ValidationError) as context:
            item.price = 29344.23
            item.full_clean()
        self.assertTrue(
            'Ensure that there are no more than 4 digits before'
            in 
            str(context.exception)
        )


class OrderTestCase(TestCase):
    def test_status_not_exist(self):
        with self.assertRaises(ValidationError) as context:
            order = Order.objects.create(
                status='not_exist'
            )
            order.full_clean()
        self.assertTrue(
            'Value \'not_exist\' is not a valid choice.'
            in 
            str(context.exception)
        )

    def test_order_total(self):
        item = Menu.objects.create(
            name = 'Pad thai',
            price=19.00
        )
        sec_item = Menu.objects.create(
            name = 'Another dish',
            price=29.00
        )
        order = Order.objects.create()
        OrderItem.objects.create(
            quantity=2,
            order=order,
            item=item
        )
        OrderItem.objects.create(
            quantity=2,
            order=order,
            item=sec_item
        )
        self.assertEqual(order.order_total(), 96.00)


class OrderItemTestCase(TestCase):
    def setUp(self):
        self.item = Menu.objects.create(
            name = 'Pad thai',
            price=20.99
        )
        self.order = Order.objects.create(
            status='pending'
        )
    
    def test_unique_items(self):
        OrderItem.objects.create(
            quantity=1,
            order=self.order,
            item=self.item
        )
        order_item = OrderItem.objects.create(
            quantity=2,
            description='',
            order=self.order,
            item=self.item
        )
        with self.assertRaises(ValidationError) as context:
            order_item.full_clean()

        self.assertTrue(            
            'Order item with this Item and Order already exists.'
            in 
            str(context.exception)
        )