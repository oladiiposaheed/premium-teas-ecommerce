import csv
import datetime
from django.http import HttpResponse
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import Order, OrderItem

# Register your models here.

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']
    
    
# Create the Export Function
def export_to_csv(modeladmin, request, queryset):
    
    # 1. Get the model details
    opts = modeladmin.model._meta
    
    # Create download file
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={opts.verbose_name}.csv'
    
    # Create the CSV writer
    writer = csv.writer(response)
    
    # 4. Get all the field names
    fields = [
        field for field in opts.get_fields() if not field.many_to_many and not field.one_to_many
    ]
    
    # 5. Write the header row
    writer.writerow([field.verbose_name for field in fields])
    
    # 6. Write the data for each selected order
    for obj in queryset:
        data_row = []
        
        for field in fields:
            value = getattr(obj, field.name)
            
            # Format the date
            if isinstance(value, datetime.datetime):
                value = value.strftime('%d/%m/%Y')
            
            data_row.append(value)
        writer.writerow(data_row)
        
    return response

export_to_csv.short_description = 'Export to CSV'
    
def order_detail(obj):
    url = reverse('admin_order_detail', args=[obj.id])
    return format_html('<a href="{}">View</a>', url)
order_detail.short_description = 'Detail'

def order_pdf(obj):
    url = reverse('admin_order_pdf', args=[obj.id])
    return format_html('<a href="{}">PDF</a>', url)
order_pdf.short_description = 'Invoice'
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    
    list_display = ['id', 'first_name', 'last_name', 'email', 'paid', 'created', order_detail, order_pdf]
    list_filter = ['paid', 'created', 'updated']
    inlines = [OrderItemInline]
    
    actions = [export_to_csv]
    

    
    
