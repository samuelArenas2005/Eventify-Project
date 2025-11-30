from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'cedula', 'name', 'last_name', 'rol', 'is_active', 'is_staff','is_admin')
    list_filter = ('rol', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'cedula', 'name', 'last_name')
    ordering = ('email',)
    
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser and not request.user.is_staff:
            return self.readonly_fields + ('is_admin',)
        return self.readonly_fields

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('name', 'last_name', 'cedula', 'phone', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_admin', 'rol',
                                  'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'name', 'last_name', 'rol', 'password1', 'password2', 'codigo', 'cedula', 'avatar'),
        }),
    )
    
