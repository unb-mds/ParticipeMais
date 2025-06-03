from django.apps import AppConfig

class ComunidadeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'comunidade'

    def ready(self):
        from . import signals  # <- Import correto do signals.py dentro do próprio app
