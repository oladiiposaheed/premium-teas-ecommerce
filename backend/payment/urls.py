from django.urls import path
from . import views, webhooks

urlpatterns = [
    path('api/payment/process/', views.PaymentProcessAPIView.as_view(), name='payment_process_api'),
    path('payment/webhook/', webhooks.stripe_webhook, name='stripe_webhook'),
]