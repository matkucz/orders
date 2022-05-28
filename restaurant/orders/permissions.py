from rest_framework import permissions

class OrderPostOnly(permissions.BasePermission):
    """
    Allow any user to post new order.
    """
    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        return False