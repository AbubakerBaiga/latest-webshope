from django.http import JsonResponse
from django.contrib.auth.models import User
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from .models import Item, Cart, CartItem
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from rest_framework import exceptions
from .serializers import ItemSerializer, CartItemSerializer 
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token


@api_view(['GET'])
def shop_base(request):
    return Response({"message": "Welcome to the Shop API"})

@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'})

@csrf_exempt  # Disable CSRF for simplicity, consider CSRF protection for production
def set_cors_headers(response):
    response["Access-Control-Allow-Origin"] = "*"  # For development only
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return response

def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['POST'])
def populate_db(request):
    try:
        with transaction.atomic():
            # Create users only if they don't exist
            for i in range(1, 7):
                username = f'testuser{i}'
                if not User.objects.filter(username=username).exists():
                    user = User.objects.create_user(username, f'{username}@shop.aa', f'pass{i}')
                else:
                    user = User.objects.get(username=username)

                # Create items for the first 3 users
                if i <= 3:
                    for j in range(10):
                        item_title = f'Item{j} for User{i}'
                        if not Item.objects.filter(owner=user, title=item_title).exists():
                            Item.objects.create(
                                owner=user,
                                title=item_title,
                                description=f'Description for Item{j} of User{i}',
                                price=100.00,
                                date_added=timezone.now()
                            )
        return JsonResponse({"message": "Database populated successfully."})
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    

@api_view(['GET'])
def item_list(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_items(request):
    query = request.GET.get('query', '')
    items = Item.objects.filter(title__icontains=query)
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_account(request):
    try:
        data = json.loads(request.body)
        user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
        return Response({'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

@api_view(['POST'])
def user_login(request):
    try:
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            login(request, user)
            print(request.user, request.user.is_authenticated, request.session)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'message': 'Login successful','csrfToken': token.key})
        else:
            return JsonResponse({'message': 'Invalid username or password'}, status=401)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_item(request):
    try:
        data = json.loads(request.body)
        item = Item.objects.create(
            owner=request.user,
            title=data['title'],
            description=data['description'],
            price=data['price'],
            date_added=timezone.now()
        )
        item_data = ItemSerializer(item).data
        return Response({'message': 'Item added successfully', 'item': item_data}, status=status.HTTP_201_CREATED)
    except ValidationError as e:
        return Response({'message': str(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        if item.owner == request.user:
            raise exceptions.ValidationError("Cannot add your own item to the cart")
        cart, created = Cart.objects.get_or_create(user=request.user)
        CartItem.objects.create(cart=cart, item=item)
        return Response({'message': 'Item added to cart successfully'})
    except Item.DoesNotExist:
        raise exceptions.NotFound('Item not found')
    except exceptions.ValidationError as e:
        return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        raise exceptions.APIException(str(e))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart_items(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': 'An error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
