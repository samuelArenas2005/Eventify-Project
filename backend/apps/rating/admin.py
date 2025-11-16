from django.contrib import admin
from .models import Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'score', 'created_at', 'updated_at')
    list_filter = ('score', 'created_at', 'event')
    search_fields = ('event__name', 'user__email', 'user__username', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('event', 'user')
    
    fieldsets = (
        (None, {
            'fields': ('event', 'user', 'score')
        }),
        ('Additional Information', {
            'fields': ('comment', 'created_at', 'updated_at')
        }),
    )
