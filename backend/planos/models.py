from django.db import models
from django.conf import settings

class Planos(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    def __str__(self):
        return self.nome