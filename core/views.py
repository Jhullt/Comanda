from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.views.decorators.http import require_GET
import json

from .models import Producto, Categoria, Bebestible, Acompanamiento, Pedido

# LOGIN
def login(request):
    return render(request, 'login.html')

# GARZON
def garzon(request):
    categorias = Categoria.objects.all()
    productos = Producto.objects.select_related('categoria').prefetch_related('ingredientes').all()
    bebestibles = Bebestible.objects.all()
    acompanamientos = Acompanamiento.objects.all()
    pedidos = list(Pedido.objects.filter(hora_entrega__isnull=True))

    return render(request, 'garzon.html', {
        'categorias': categorias,
        'productos': productos,
        'bebestibles': bebestibles,
        'acompanamientos': acompanamientos,
        'pedidos': pedidos,
    })

# REGISTRAR PEDIDO
@csrf_exempt
def registrar_pedido(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            mesa = data.get('mesa')
            numero_pedido = Pedido.objects.filter(mesa=mesa).count() + 1

            pedido = Pedido.objects.create(
                numero_pedido=numero_pedido,
                mesa=mesa,
                garzon=data.get('garzon'),
                comensales=data.get('comensales'),
                total=data.get('total'),
                hora_creacion=timezone.now()
            )

            productos = data.get('productos', [])
            for prod in productos:
                DetallePedido.objects.create(
                    pedido=pedido,
                    producto=prod.get('producto'),
                    ingredientes=prod.get('ingredientes'),
                    acompanamientos=prod.get('acompanamientos'),
                    precio=prod.get('precio')
                )

            return JsonResponse({'ok': True, 'numero_pedido': pedido.numero_pedido})
        except Exception as e:
            return JsonResponse({'ok': False, 'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)




# OBTENER PEDIDO ACTIVO POR MESA
@require_GET
def obtener_pedido(request):
    mesa = request.GET.get('mesa')
    if not mesa:
        return JsonResponse({'ok': False, 'error': 'Mesa no especificada'}, status=400)

    try:
        pedido = Pedido.objects.filter(mesa=mesa, hora_entrega__isnull=True).latest('hora_creacion')
        return JsonResponse({
            'ok': True,
            'numero_pedido': pedido.numero_pedido,
            'detalle': pedido.detalle,
            'total': pedido.total
        })
    except Pedido.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'No hay pedido activo para esta mesa'})
