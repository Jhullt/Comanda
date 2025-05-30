from django import template

register = template.Library()

@register.filter
def get_range(value):
    return range(1, value + 1)

@register.filter
def pretty_name(value):
    return value.replace("_", " ").title()

@register.filter
def get_pedido_by_mesa(pedidos, mesa):
    """
    Retorna el pedido activo (no entregado) asociado a una mesa específica.
    """
    for pedido in pedidos:
        if pedido.mesa == mesa and pedido.hora_entrega is None:
            return pedido
    return None

@register.filter
def get_item(queryset, nombre_mesa):
    return queryset.filter(mesa=nombre_mesa).first()

@register.filter
def concat(a, b):
    return f"{a}{b}"

@register.filter
def get_mesa(pedidos, mesa_name):
    return next((p for p in pedidos if p.mesa == mesa_name), None)

