from django.db import models
from conferencias.models import Conferencia, Etapas
from planos.models import Planos
from consultas.models import Consultas

class Propostas(models.Model):
    titulo_proposta = models.CharField(max_length=400)
    autor = models.CharField(max_length=100)
    descricao_proposta = models.TextField()
    qtd_votos = models.IntegerField(default=0)
    url_proposta = models.URLField(max_length=500, blank=True, null=True)

    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE, null=True, blank=True)
    etapa = models.ForeignKey(Etapas, on_delete=models.SET_NULL, null=True, blank=True)
    plano = models.ForeignKey(Planos, on_delete=models.CASCADE, null=True, blank=True)
    consulta = models.ForeignKey(Consultas, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.titulo_proposta
