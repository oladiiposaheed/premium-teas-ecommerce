#from django.shortcuts import render
from rest_framework import generics
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductListView(generics.ListAPIView):
    
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        
        # 1. Start with all available products
        queryset = Product.objects.filter(available=True)
        
        # 2. Check if the URL has a category_slug 
        category_slug = self.kwargs.get('category_slug')
        
        # 3. If a category slug exists in the URL, filter available products
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
         
        # Return final list   
        return queryset

    
class ProductDetailView(generics.RetrieveAPIView):
    # filters by available!
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'  
    
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
