from django.urls import path
from . import views


urlpatterns = [
    path('api/products/', views.ProductListView.as_view(), name='product_list_api'),
    path('api/products/<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail_api'),
    path('api/categories/', views.CategoryListView.as_view(), name='category_list_api'),   
]
