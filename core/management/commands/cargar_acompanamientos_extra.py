import csv
from django.core.management.base import BaseCommand
from core.models import AcompanamientoExtra  # Cambia si tu modelo está en otra app

class Command(BaseCommand):
    help = 'Carga acompanamientos extra desde acompanamientos_extra.csv'

    def handle(self, *args, **kwargs):
        with open('acompanamientos_extra.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                AcompanamientoExtra.objects.update_or_create(
                    nombre=row['nombre'],
                    defaults={
                        'precio': int(row['precio']),
                        'stock': int(row['stock'])
                    }
                )
        self.stdout.write(self.style.SUCCESS('Acompanamientos extra cargados con éxito.'))
