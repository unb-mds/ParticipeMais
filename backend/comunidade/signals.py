from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comentarios, Curtidas, UsuarioScore
from django.conf import settings

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def criar_score_usuario(sender, instance, created, **kwargs):
    """
    Cria automaticamente um UsuarioScore com pontos = 0 
    sempre que um novo usuário é registrado.
    """
    if created:
        UsuarioScore.objects.create(usuario=instance)

def atualizar_pontuacao(usuario, pontos):
    """
    Atualiza a pontuação do usuário. Se ainda não existir, cria um UsuarioScore.

    :param usuario: O usuário cuja pontuação será atualizada.
    :param pontos: A quantidade de pontos a ser adicionada ou subtraída.
    """
    score, _ = UsuarioScore.objects.get_or_create(usuario=usuario)
    score.pontos += pontos
    score.save()


# Sinal para adicionar pontuação ao criar um comentário
@receiver(post_save, sender=Comentarios)
def adicionar_pontuacao_comentario(sender, instance, created, **kwargs):
    if created:
        atualizar_pontuacao(instance.autor, 5)

# Sinal para adicionar pontuação ao criar uma curtida
@receiver(post_save, sender=Curtidas)
def adicionar_pontuacao_curtida(sender, instance, created, **kwargs):
    if created:
        atualizar_pontuacao(instance.usuario, 5)
