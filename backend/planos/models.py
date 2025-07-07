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
    categorias = models.ManyToManyField(Categoria, blank=True, related_name='planos')
    palavras_chaves = models.CharField(max_length=1000, default="", blank=True)

    def __str__(self):
        return str(self.nome)  # Garante que o retorno seja uma string
    
class Oficinas(models.Model):
    titulo_oficina = models.CharField(max_length=500)
    descricao_oficina = models.TextField()
    status = models.CharField(max_length=50)
    regiao_oficina = models.CharField(default="não informado", max_length=250)
    duracao_oficina = models.CharField(max_length=100, default="não informado", null=False, blank=False)
    qtd_propostas_oficina = models.IntegerField(default=0, null=True)
    qtd_inscritos_oficina = models.IntegerField(default=0, null=True)
    propostas_relacionadas = models.TextField(blank=True, null=True)
    plano = models.ForeignKey(Planos, on_delete=models.CASCADE)
    def __str__(self):
        return self.titulo_etapa
