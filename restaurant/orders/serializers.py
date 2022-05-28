from rest_framework import serializers

from orders.models import Menu, Order, OrderItem


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['quantity', 'description', 'item']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, required=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'order_items']
    
    def validate_order_items(self, value):
        if not value:
            raise serializers.ValidationError('Empty order items.')
        items = [item['item'] for item in value]
        if len(items) != len(set(items)):
            raise serializers.ValidationError('Duplicates in order.')
        return value
    
    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        order = Order.objects.create(**validated_data)
        for item in order_items_data:
            OrderItem.objects.create(
                quantity=item['quantity'],
                order=order,
                item=item['item']
            )
        return order


class EditOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']


class OrderListSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'order_items', 'order_total']