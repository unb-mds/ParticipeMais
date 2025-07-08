"""Modelos para o app de planos."""

from django.db import models
from propostas.models import Categoria


class Planos(models.Model):
    """Modelo representando um plano disponível para propostas."""

    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL, related_name='planos')

    palavras_chaves = models.CharField(max_length=2000, default="", blank=True)

    def __str__(self):
        return str(self.nome)  # Garante que o retorno seja uma string
