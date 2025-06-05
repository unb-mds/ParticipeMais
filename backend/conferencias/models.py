from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class Conferencia(models.Model):
    titulo = models.TextField(default="Sem titulo")
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    data_subconferencia = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    def __str__(self):
        return self.titulo

class PerguntasParticipativas(models.Model):
    perguntas = models.TextField()
    respostas = models.TextField()
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE)

class Etapas(models.Model):
    titulo_etapa = models.CharField(max_length=500)
    descricao_etapa = models.TextField()
    status = models.CharField(max_length=50)
    regiao_etapa = models.CharField(default="não informado", max_length=250)
    duracao_etapa = models.CharField(max_length=100)
    qtd_propostas_etapa = models.IntegerField(default=0, null=True)
    qtd_inscritos_etapa = models.IntegerField(default=0, null=True)
    url_etapa = models.URLField(max_length=500, blank=True, null=True)
    propostas_relacionadas = models.TextField(blank=True, null=True)
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE)
    def __str__(self):
        return self.titulo_etapa