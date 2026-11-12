from django.urls import path
from . import views

urlpatterns = [
    path('api/orders/create/', views.OrderCreateAPIView.as_view(), name='order_create_api'),
    path('order-detail/<int:order_id>/', views.admin_order_detail, name='admin_order_detail'),
    path('order-pdf/<int:order_id>/', views.admin_order_pdf, name='admin_order_pdf'),
]
