from django.db import models
from django.utils.html import format_html
from django.templatetags.static import static
from django.utils import timezone

# CATEGORÍA DE PRODUCTOS
class Categoria(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

# INGREDIENTES
class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

# ACOMPAÑAMIENTO
class Acompanamiento(models.Model):
    nombre = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)
    precio = models.PositiveIntegerField(default=0)

    def __str__(self):
        if self.precio > 0:
            return f"{self.nombre} (+${self.precio:,})"
        return self.nombre

# PRODUCTO
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)
    imagen = models.CharField(max_length=200, blank=True)
    precio = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.nombre

    def precio_humanizado(self):
        return f"${self.precio:,}".replace(",", ".")

    def mostrar_imagen(self):
        if self.imagen:
            ruta = static(self.imagen)
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', ruta)
        return "Sin imagen"

# BEBESTIBLE
class Bebestible(models.Model):
    nombre = models.CharField(max_length=100)
    imagen = models.CharField(max_length=200, blank=True)
    precio = models.PositiveIntegerField()
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

    def precio_humanizado(self):
        return f"${self.precio:,}".replace(",", ".")

    def mostrar_imagen(self):
        if self.imagen:
            ruta = static(self.imagen)
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', ruta)
        return "Sin imagen"
    
# PEDIDO

class Pedido(models.Model):
    numero_pedido = models.PositiveIntegerField()
    mesa = models.CharField(max_length=20)
    garzon = models.CharField(max_length=100)
    comensales = models.PositiveIntegerField(default=1)
    detalle = models.TextField()
    total = models.PositiveIntegerField(default=0)
    hora_creacion = models.DateTimeField(default=timezone.now)
    hora_entrega = models.DateTimeField(null=True, blank=True)

    @property
    def tiempo_entrega(self):
        if self.hora_entrega:
            return self.hora_entrega - self.hora_creacion
        return None

    def __str__(self):
        return f"Pedido {self.numero_pedido} - {self.mesa}"
    