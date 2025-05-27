from django.db import models
from django.utils.html import format_html

# INGREDIENTES (con stock)
class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

# ACOMPAÑAMIENTO (sin precio, pero con stock)
class Acompanamiento(models.Model):
    nombre = models.CharField(max_length=100)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

# ACOMPAÑAMIENTO EXTRA (con precio y stock)
class AcompanamientoExtra(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.PositiveIntegerField()
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nombre} (+${self.precio:,})"

# PRODUCTO (sin campos de acompañamientos)
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)
    imagen = models.ImageField(upload_to='productos/')
    precio = models.PositiveIntegerField()

    def __str__(self):
        return self.nombre

    def precio_humanizado(self):
        return f"${self.precio:,}".replace(",", ".")

    def mostrar_imagen(self):
        if self.imagen:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', self.imagen.url)
        return "Sin imagen"
