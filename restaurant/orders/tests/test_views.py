import json

from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import (
    APIRequestFactory,
    force_authenticate,
)

from orders.models import Menu, Order
from orders.views import (
    MenuDetail,
    MenuList,
    OrderDetail,
    OrderList,
)

class MenuTestCase(TestCase):
    def setUp(self):
        User = get_user_model()        
        self.factory = APIRequestFactory()
        self.user = User.objects.create(
            email='',
            username='user',
            password='password',
            is_active=True
        )
        Menu.objects.create(
            name='Pad thai',
            price=19.99
        )

    def test_post_menu_item(self):
        request = self.factory.post('/api/menu/',
            {
                'name': 'Pad thai',
                'price': 19.19,
            }
        )
        response = MenuList.as_view()(request)
        self.assertTrue(
            response.data['detail'],
            'Authentication credentials were not provided.'
        )
    
    def test_post_menu_item_authenticated(self):
        request = self.factory.post('/api/menu/',
            {
                'name': 'Pad thai',
                'price': 19.19,
            }
        )
        force_authenticate(request, user=self.user)
        response = MenuList.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_post_menu_item_invalid_price(self):
        request = self.factory.post('/api/menu/',
            {
                'name': 'Pad thai',
                'price': 19.122,
            }
        )
        force_authenticate(request, user=self.user)
        response = MenuList.as_view()(request)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(
            'Ensure that there are no more than 2 decimal places.'
            in
            response.data['price']
        )

        request = self.factory.post('/api/menu/',
            {
                'name': 'Pad thai',
                'price': 22219,
            }
        )
        force_authenticate(request, user=self.user)
        response = MenuList.as_view()(request)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(
            'Ensure that there are no more than 4 digits before the decimal point.'
            in
            response.data['price']
        )

    def test_post_menu_item_invalid_name(self):
        request = self.factory.post('/api/menu/',
            {
                'price': 19.19,
            }
        )
        force_authenticate(request, user=self.user)
        response = MenuList.as_view()(request)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(
            'This field is required.'
            in
            response.data['name']
        )
    
    def test_put_menu_item(self):
        request = self.factory.put('/api/menu/', data={
            'name': 'Pad thai',
            'status': 'completed'
        })
        response = MenuDetail.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 401)
        self.assertTrue(
            response.data['detail'],
            'Authentication credentials were not provided.'
        )
        
        request = self.factory.put('/api/menu/', {
            'name': 'Pad thai',
            'status': 'completed'
        })
        force_authenticate(request, user=self.user)
        response = MenuDetail.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 201)

    def test_delete_menu_item(self):
        request = self.factory.delete('/api/menu/')
        response = MenuDetail.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 401)
        self.assertTrue(
            response.data['detail'],
            'Authentication credentials were not provided.'
        )
        
        request = self.factory.delete('/api/menu/')
        force_authenticate(request, user=self.user)
        response = MenuDetail.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 204)


class OrderTestCase(TestCase):
    def setUp(self):
        User = get_user_model()        
        self.factory = APIRequestFactory()
        self.user = User.objects.create(
            email='',
            username='user',
            password='password',
            is_active=True
        )
        self.item = Menu.objects.create(
            name='Pad thai',
            price=19.99
        )
        self.order = Order.objects.create(
            status='pending'
        )