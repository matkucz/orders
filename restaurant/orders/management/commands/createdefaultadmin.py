from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create default superuser'

    def handle(self, *args, **options):
        self.stdout.write('Creating default admin account.')
        User = get_user_model()
        admin = settings.ADMIN
        username = admin['USERNAME']
        password = admin['PASSWORD']
        admin_account = User.objects.create_superuser(email='', username=username, password=password)
        admin_account.is_active = True
        admin_account.is_admin = True
        admin_account.save()
        self.stdout.write(self.style.SUCCESS('Successfully created admin account'))