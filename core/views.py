from django.shortcuts import render
from .models import Producto, Categoria, Bebestible

# LOGIN
def login(request):
    return render(request, 'login.html')

# GARZON
def garzon(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.select_related('categoria').all()
    bebestibles = Bebestible.objects.all()

    return render(request, 'garzon.html', {
        'categorias': categorias,
        'productos': productos,
        'bebestibles': bebestibles
    })
