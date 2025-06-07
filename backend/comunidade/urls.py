from django.urls import path
from .views import *

urlpatterns = [
    path('score/', ScoreView.as_view(), name='score'),
    path('', ComunidadeView.as_view(), name='comunidade'), #principal da comunidade, lista as perguntas e seu total
    path('carrosel', ComentarioCarrossel.asView(), name='carrossel_comentarios'),#endpoint para carrossel de coment na pag comunidade
    path('chat/<int:pk>/', ChatView.as_view(), name='chat_pergunta'),#acessar chat da pergunta especifica
    path('comentarios/<int:pk>/curtir/', CurtidaView.as_view(), name='curtir_comentario'),#curtir comentario na pag chat

]
