from django.contrib import admin
from .models import Producto, Ingrediente, Acompanamiento, AcompanamientoExtra

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_humanizado', 'mostrar_imagen')
    filter_horizontal = ('ingredientes',)

@admin.register(Ingrediente)
class IngredienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock')

@admin.register(Acompanamiento)
class AcompanamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock')

@admin.register(AcompanamientoExtra)
class AcompanamientoExtraAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock')
