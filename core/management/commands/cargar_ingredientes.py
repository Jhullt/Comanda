import csv
from django.core.management.base import BaseCommand
from core.models import Ingrediente  # Asegúrate que 'Ingrediente' esté en core.models

class Command(BaseCommand):
    help = 'Carga ingredientes desde ingredientes_con_stock.csv'

    def handle(self, *args, **kwargs):
        with open('ingredientes_con_stock.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Ingrediente.objects.update_or_create(
                    nombre=row['nombre'],
                    defaults={'stock': int(row['stock'])}
                )
        self.stdout.write(self.style.SUCCESS('Ingredientes cargados con éxito.'))
