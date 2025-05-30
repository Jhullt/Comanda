from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('garzon/', views.garzon, name='garzon'),
    path('registrar-pedido/', views.registrar_pedido, name='registrar_pedido'),
]
