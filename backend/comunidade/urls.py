from django.urls import path
from .views import *

urlpatterns = [
    path('score/', ScoreView.as_view(), name='score'),
    path('', ComunidadeView.as_view(), name='comunidade'), #principal da comunidade, lista as perguntas e seu total
    path('criachat/', CriarChat.as_view(), name='crie_seu_chat'), #criar chats 
    path('carrosel/', ComentarioCarrossel.as_view(), name='carrossel_comentarios'),#endpoint para carrossel de coment na pag comunidade
    path('chat/<int:pk>/', ChatView.as_view(), name='chat_pergunta'),#acessar chat da pergunta especifica
    path('chat/<int:chat_pk>/comentarios/<int:comentario_pk>/curtir/', CurtidaView.as_view(), name='curtir_comentario')


]
