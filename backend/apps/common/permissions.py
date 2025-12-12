from rest_framework.permissions import BasePermission


class IsAdminAttributeUser(BasePermission):
    """Allows access only to authenticated users with is_admin flag."""

    message = 'Solo los administradores pueden realizar esta acción.'

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        return bool(user and user.is_authenticated and getattr(user, 'is_admin', False))


class IsEventCreatorOrReadOnly(BasePermission):
    """Permite ver a cualquiera, pero solo el creador puede modificar/eliminar el evento."""

    message = 'Solo el creador del evento puede modificarlo o eliminarlo.'

    def has_permission(self, request, view):
        # Permitir GET, HEAD, OPTIONS a todos
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Para POST (crear), debe estar autenticado
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permitir GET, HEAD, OPTIONS a todos
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Para PUT, PATCH, DELETE: solo el creador
        return obj.creator == request.user
