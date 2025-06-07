from django.db import models

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from autenticacao.models import Usuario

class Chat(models.Model):
    pergunta = models.TextField()
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.pergunta

class Comentarios(models.Model):
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='comentarios')
    def __str__(self):
        return f"{self.autor.nome} - {self.data_criacao}"

class Curtidas(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.ForeignKey(Comentarios, on_delete=models.CASCADE)
    curtido = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.usuario.nome} -> {self.comentario.id} | Curtido: {self.curtido}"
    
    class Meta:
        unique_together = ('usuario', 'comentario')
class UsuarioScore(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pontos = models.IntegerField(default=0)