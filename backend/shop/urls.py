from django.urls import path
from . import views

urlpatterns = [
    path('api/populate_db/', views.populate_db, name='populate_db'),
    path('api/search_items/', views.search_items, name='search_items'),
    path('api/items/', views.item_list, name='item_list'),
    path('api/create_account/', views.create_account, name='create_account'),
    path('api/login/', views.user_login, name='login'),
    path('api/add_item/', views.add_item, name='add_item'),
    path('api/add_to_cart/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('api/cart/items/', views.view_cart_items, name='view_cart_items'),
    path('api/logout/', views.user_logout, name='user_logout'),
    path('', views.shop_base, name='shop_base'),
    path('api/get-csrf', views.get_csrf, name='get_csrf'),
]
