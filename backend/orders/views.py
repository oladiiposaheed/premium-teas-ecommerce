from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from cart.cart import Cart
from .models import Order, OrderItem
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import get_object_or_404, render
from xhtml2pdf import pisa
import io
from django.http import HttpResponse
from django.template.loader import render_to_string


@method_decorator(csrf_exempt, name='dispatch')
class OrderCreateAPIView(APIView):
    
    # DRF to skip authentication/CSRF
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        # 1. Get the cart from the session
        cart = Cart(request)
        
        # 2. Check if the cart is empty
        if len(cart) == 0:
            return Response(
                {'error': 'Your cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )    
            
        # 3. Get the customer data sent from Next.js
        data = request.data
        try:
            # 4. Create the Order in the database
            order = Order.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                address=data['address'],
                postal_code=data['postal_code'],
                city=data['city']
            )
            
            # 5. Loop through the cart and create OrderItems
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    price=item['price'],
                    quantity=item['quantity']
                )
                
            # 6. Clear the cart session
            cart.clear()
            
            # 7. Return the new Order ID to Next.js
            return Response(
                {'order_id': order.id},
                status=status.HTTP_201_CREATED
            )
            
        except KeyError as e:
            return Response(
                {'error': f'Missing field: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    
@staff_member_required
def admin_order_detail(request, order_id):
    
    # 1. Find the order by its ID, or return a 404 error if it doesn't exist
    order = get_object_or_404(Order, id=order_id)
    dict = {'order': order}
    
    # 2. Render the custom HTML template, passing the order data to it
    return render(request, 'admin/orders/order/detail.html', context=dict)


# Create the PDF View
@staff_member_required
def admin_order_pdf(request, order_id):
    
    # 1. Get the order
    order = get_object_or_404(Order, id=order_id)
    
    dict = {'order': order}
    
    # 2. Render the HTML template
    html = render_to_string('admin/orders/order/pdf.html', context=dict)
    
    # 3. Create a file-like buffer to receive PDF data
    result = io.BytesIO()
    
    # 4. Translate HTML to PDF
    pdf = pisa.CreatePDF(
        io.BytesIO(html.encode('UTF-8')),
        dest=result
    )
    
    # 5. Check if there was an error generating the PDF
    if not pdf.err:
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'filename=order_{order.id}.pdf'
        return response
    
    return HttpResponse('Error generating PDF', status=500)
    
    

