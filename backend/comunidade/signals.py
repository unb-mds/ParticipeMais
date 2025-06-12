from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comentarios, Curtidas, UsuarioScore
from django.conf import settings

@receiver(post_save, sender=Comentarios)
def adicionar_pontuacao_comentario(sender, instance, created, **kwargs):
    if created:
        atualizar_pontuacao(instance.autor, 5)

@receiver(post_save, sender=Curtidas)
def adicionar_pontuacao_curtida(sender, instance, created, **kwargs):
    if created:
        atualizar_pontuacao(instance.usuario, 5)

def atualizar_pontuacao(usuario, pontos):
    score, _ = UsuarioScore.objects.get_or_create(usuario=usuario)
    score.pontos += pontos
    score.save()
