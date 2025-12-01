from rest_framework.permissions import BasePermission


class IsAdminAttributeUser(BasePermission):
    """Allows access only to authenticated users with is_admin flag."""

    message = 'Solo los administradores pueden realizar esta acción.'

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        return bool(user and user.is_authenticated and getattr(user, 'is_admin', False))
