"""
Sinais para atualização de pontuação na comunidade do ParticipeMais.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comentarios, Curtidas, UsuarioScore

@receiver(post_save, sender=Comentarios)
def adicionar_pontuacao_comentario(sender, instance, created, **kwargs):
    """
    Adiciona pontos ao autor ao criar um comentário.
    """
    if created:
        atualizar_pontuacao(instance.autor, 5)

@receiver(post_save, sender=Curtidas)
def adicionar_pontuacao_curtida(sender, instance, created, **kwargs):
    """
    Adiciona pontos ao usuário ao receber uma curtida.
    """
    if created:
        atualizar_pontuacao(instance.usuario, 5)

def atualizar_pontuacao(usuario, pontos):
    """
    Atualiza a pontuação do usuário.
    """
    score, _ = UsuarioScore.objects.get_or_create(usuario=usuario)
    score.pontos += pontos
    score.atualizar_nivel()
    score.save()
