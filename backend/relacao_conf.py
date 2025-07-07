import os
import re
import django
import pandas as pd
from pathlib import Path

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from conferencias.models import Conferencia, Etapas, PerguntasParticipativas
from planos.models import Planos
from consultas.models import Consultas
from propostas.models import Propostas, Categoria
