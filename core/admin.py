from django.contrib import admin
from .models import Producto, Ingrediente, Acompanamiento, Categoria, Bebestible

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_humanizado', 'mostrar_imagen', 'categoria')
    filter_horizontal = ('ingredientes',)

@admin.register(Ingrediente)
class IngredienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock')

@admin.register(Acompanamiento)
class AcompanamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)

@admin.register(Bebestible)
class BebestibleAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_humanizado', 'stock', 'mostrar_imagen')
