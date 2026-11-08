from django.urls import path
from . import api_views

urlpatterns = [
    path('api/cart/', api_views.CartDetailAPIView.as_view(), name='cart_detail_api'),
    path('api/cart/add/', api_views.CartAddAPIView.as_view(), name='cart_add_api'),
    path('api/cart/remove/', api_views.CartRemoveAPIView.as_view(), name='cart_remove_api'),
]
