import csv
from django.core.management.base import BaseCommand
from core.models import Acompanamiento  # Cambia si tu modelo está en otra app

class Command(BaseCommand):
    help = 'Carga acompanamientos desde acompanamientos_con_stock.csv'

    def handle(self, *args, **kwargs):
        with open('acompanamientos_con_stock.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Acompanamiento.objects.update_or_create(
                    nombre=row['nombre'],
                    defaults={'stock': int(row['stock'])}
                )
        self.stdout.write(self.style.SUCCESS('Acompanamientos cargados con éxito.'))
