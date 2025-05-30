from django.shortcuts import render
from .models import Producto, Categoria, Bebestible, Acompanamiento

# LOGIN
def login(request):
    return render(request, 'login.html')

# GARZON
def garzon(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.select_related('categoria').prefetch_related('ingredientes').all()
    bebestibles = Bebestible.objects.all()
    acompanamientos = Acompanamiento.objects.all()

    return render(request, 'garzon.html', {
        'categorias': categorias,
        'productos': productos,
        'bebestibles': bebestibles,
        'acompanamientos': acompanamientos
    })
