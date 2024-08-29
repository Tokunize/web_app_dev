# property/management/commands/create_properties.py

from django.core.management.base import BaseCommand
from property.factories import PropertyFactory  # Ajusta esta importación si es necesario

class Command(BaseCommand):
    help = 'Creates new property instances using PropertyFactory'

    def add_arguments(self, parser):
        parser.add_argument('--num', type=int, default=10, help='Number of properties to create')

    def handle(self, *args, **options):
        num_properties = options['num']
        created_count = 0

        for _ in range(num_properties):
            property_instance = PropertyFactory.create()
            created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} properties.'))

