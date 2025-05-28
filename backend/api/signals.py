from .models import Comentario
from django.db.models.signals import post_save
from django.dispatch import receiver


def atualizar_pontuacao(usuario, pontos):
    """
    Atualiza a pontuação do usuário.
    
    :param usuario: O usuário cuja pontuação será atualizada.
    :param pontos: A quantidade de pontos a ser adicionada ou subtraída.
    """
    from .models import UsuarioScore  # Importa o modelo Usuario

    score = UsuarioScore.objects.get_or_create(usuario=usuario)
    score.pontos += pontos
    score.save()

#Isso faz com que toda vez que um comentario for criado, chame essa funcao
@receiver(post_save, sender='Comentario')   
def adicionar_pontuacao_comentar(sender, instance, created, **kwargs):
    """
    Adiciona pontos ao usuário por comentar.
    
    :param usuario: O usuário que comentou.
    :param pontos: A quantidade de pontos a ser adicionada.
    
    """
    if created:
        atualizar_pontuacao(instance.usuario, 5)
        
        
@receiver(post_save, sender='Curtida')   
def adicionar_pontuacao_curtidas(sender, instance, created, **kwargs):
    """
    Adiciona pontos ao usuário por comentar.
    
    :param usuario: O usuário que comentou.
    :param pontos: A quantidade de pontos a ser adicionada.
    
    """
    if created:
        atualizar_pontuacao(instance.usuario, 5)
        

