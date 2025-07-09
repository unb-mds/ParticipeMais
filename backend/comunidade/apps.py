from django.apps import AppConfig

"""
Configuração do aplicativo Comunidade
Esta classe é responsável por configurar o aplicativo 'comunidade' dentro do projeto Django.
"""
class ComunidadeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'comunidade'

    def ready(self):
        from . import signals  # <- Import correto do signals.py dentro do próprio app
