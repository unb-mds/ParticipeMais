from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from propostas.models import Categoria

class Consultas(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    link = models.URLField(max_length=500, blank=True, null=True)
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL, related_name='consultas')
    palavras_chaves = models.CharField(max_length=2000, default="", blank=True)

    def __str__(self):
        return self.nome