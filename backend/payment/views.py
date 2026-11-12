from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from decimal import Decimal
import stripe
from orders.models import Order
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# Set the Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_version = '2024-04-10'

@method_decorator(csrf_exempt, name='dispatch')
class PaymentProcessAPIView(APIView):
    
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        # 1. Get the order_id sent from Next.js
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response(
                {'error': 'Order ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Redirect URLs back to Next.js
        success_url = 'http://localhost:3000/checkout/success'
        cancel_url = 'http://localhost:3000/checkout/cancelled'
        
        # 3. Build the line items for Stripe (the products and their prices)
        line_items = []
        for item in order.items.all():
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': int(item.price * Decimal('100')),
                    'product_data': {
                        'name': item.product.name,
                    },
                },
                'quantity': item.quantity,
            })
            
        # 4. Create the Stripe Checkout Session
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                # The client_reference_id is CRUCIAL. It links the Stripe payment back to our Order ID.
                client_reference_id=order.id,
                success_url=success_url,
                cancel_url=cancel_url,
            )
            
            # 5. Return the Stripe URL to Next.js so it can redirect the user
            return Response(
                {'checkout_url': session.url}
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )