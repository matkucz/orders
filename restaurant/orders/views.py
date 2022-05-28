from django.http import Http404
from django.db.models import Q

from rest_framework import authentication, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from orders.models import Menu, Order, OrderItem
from orders.permissions import OrderPostOnly
from orders.serializers import (
    EditOrderStatusSerializer,
    MenuSerializer,
    OrderListSerializer,
    OrderSerializer,
)


class MenuList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        menu_items = Menu.objects.all()
        serializer = MenuSerializer(menu_items, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = MenuSerializer(data=request.data)        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MenuDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Menu.objects.get(pk=pk)
        except:
            raise Http404

    def put(self, request, pk, format=None):
        menu_item = self.get_object(pk)
        serializer = MenuSerializer(menu_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        menu_item = self.get_object(pk)
        menu_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderList(APIView):
    permission_classes = [permissions.IsAuthenticated|OrderPostOnly]

    def get(self, request, format=None):
        orders = Order.objects.exclude(status='canceled')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Order.objects.get(
                Q(pk=pk) & ~Q(status='canceled')
            ) 
        except:
            raise Http404

    def get(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = EditOrderStatusSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        order = self.get_object(pk)
        order.status = 'canceled'
        order.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

