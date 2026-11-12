import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from orders.models import Order


@csrf_exempt
def stripe_webhook(request):
    
    # Get the raw request body (required for signature verification)
    payload = request.body
    
    # Extract the cryptographic signature header
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    # Initialize the event variable
    event = None
    
    try:
        # # Verify the signature and parse the payload to ensure the request actually came from Stripe
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)
    
    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Check if it was a successful payment
        if session.mode == 'payment' and session.payment_status == 'paid':
            try:
                # Find the specific order in the database
                order = Order.objects.get(id=session.client_reference_id)
                
            except Order.DoesNotExist:
                return HttpResponse(status=404)
            
            # Mark the order as paid!
            order.paid = True
            order.save()
            
    return HttpResponse(status=200)