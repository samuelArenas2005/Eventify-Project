from django.contrib import admin
from .models import Category, Event, EventAttendee, EventImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'created_at', 'updated_at')
    search_fields = ('category',)
    readonly_fields = ('created_at', 'updated_at')

class EventImageInline(admin.TabularInline):
    model = EventImage
    extra = 1

class EventAttendeeInline(admin.TabularInline):
    model = EventAttendee
    extra = 1
    raw_id_fields = ('user',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'start_date', 'end_date', 'status', 'creator', 'capacity')
    list_filter = ('status', 'categories', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'address', 'creator__email')
    raw_id_fields = ('creator',)
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('categories',)
    
    inlines = [EventImageInline, EventAttendeeInline]
    

@admin.register(EventAttendee)
class EventAttendeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'event__title')
    raw_id_fields = ('user', 'event')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(EventImage)
class EventImageAdmin(admin.ModelAdmin):
    list_display = ('event', 'image', 'created_at')
    search_fields = ('event__title',)
    raw_id_fields = ('event',)
    readonly_fields = ('created_at', 'updated_at')
