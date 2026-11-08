from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from shop.models import Product
from .cart import Cart


@method_decorator(csrf_exempt, name='dispatch')
class CartDetailAPIView(APIView):
    '''Retrieve the current cart contents and total price.'''
    
    
    # skip authentication and CSRF
    authentication_classes = []
    permission_classes = []
    
    def get(self, request):
        
        # 1. Initialize the cart using the user's session
        cart = Cart(request)
        
        # 2. Create an empty list to hold our JSON data
        cart_data = []
        
        # Iterate over the cart
        for item in cart:
            cart_data.append({
                'product_id': item['product'].id,
                'name': item['product'].name,
                'quantity': item['quantity'],
                'price':  item['price'],
                'total_price': str(item['total_price']),
                'image': item['product'].image.url if item['product'].image else None,
            })
            
        # 5. Send the final JSON response back to Next.js
        return Response({
            'items': cart_data,
            'total_price': str(cart.get_total_price()),
            'total_items': len(cart)
        })
        
@method_decorator(csrf_exempt, name='dispatch') 
class CartAddAPIView(APIView):
    '''Add a product to the cart from frontend to backend.'''
    
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
    
        # 1. Initialize the cart
        cart = Cart(request)
        
        # 2. Get the data sent from Next.js
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        override = request.data.get('override', False)
        
        # Check for product in the database
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        # 4. Add it to the cart
        cart.add(product=product, quantity=quantity, override_quantity=override)
        
        # 5. Send a success message back
        return Response({
            'message': 'Item added', 'total_items': len(cart)
        })
        
@method_decorator(csrf_exempt, name='dispatch')        
class CartRemoveAPIView(APIView):
    '''Remove a product entirely from the cart.'''
    
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        cart = Cart(request)
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        cart.remove(product)
        return Response({'message': 'Item removed'})