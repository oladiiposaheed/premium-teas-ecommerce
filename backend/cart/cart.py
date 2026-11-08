from decimal import Decimal
from django.conf import settings
from shop.models import Product


class Cart:
    
    def __init__(self, request):
        '''
        Initialize the cart from the session or create a new empty one.
        '''
        
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
            
        # Save the cart dictionary
        self.cart = cart
        
        
    def add(self, product, quantity=1, override_quantity=False):
        '''
        Add a product to the cart or update its quantity.
        '''
        
        product_id = str(product.id)
        
        if product_id not in self.cart:
            # Store price as a string to avoid JSON serialization issues in the session
            self.cart[product_id] = {'quantity': 0, 'price': str(product.price)}
            
        if override_quantity:
            self.cart[product_id]['quantity'] = quantity
        else:
            self.cart[product_id]['quantity'] += quantity
            
        self.save()
        
        
    def save(self):
        '''
        Mark the session as modified to ensure it is saved
        '''
        
        self.session.modified = True
        
    def remove(self, product):
        '''
        Remove a product entirely from the cart.
        '''
        
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()
        
        
    def __iter__(self):
        '''
        Iterate over cart items and attach full Product objects from the database
        '''
        
        # extract all the ids in the session cart
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)
        # Make a copy 
        cart = self.cart.copy()
        
        for product in products:
            cart[str(product.id)]['product'] = product
            
        # Calculate totals for each item in the cart
        for item in cart.values():
            item['price'] = Decimal(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            
            yield item
        
        
    def __len__(self):
        '''Count the total number of items in the cart.'''
        
        return sum(item['quantity'] for item in self.cart.values())
    
    
    def get_total_price(self):
        '''Calculate the total cost of all items in the cart.'''
        
        return sum(Decimal(item['price']) * item['quantity'] for item in self.cart.values())
    
    
    def clear(self):
        '''Remove the entire cart from the session (used after checkout).'''
        
        del self.session[self.session.CART_SESSION_ID]
        self.save()