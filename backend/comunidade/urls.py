from django.urls import path
from .views import ScoreView, CategoriaView,ComunidadeView, CriarChat, ComentarioCarrossel, ChatView, CurtidaView

urlpatterns = [
    path('score/', ScoreView.as_view(), name='score'),
    path('', ComunidadeView.as_view(), name='comunidade'), 
    path('criachat/', CriarChat.as_view(), name='crie_seu_chat'), 
    path('carrosel/', ComentarioCarrossel.as_view(), name='carrossel_comentarios'),
    path('chat/<int:pk>/', ChatView.as_view(), name='chat_pergunta'),
    path('chat/<int:chat_pk>/comentarios/<int:comentario_pk>/curtir/', CurtidaView.as_view(), name='curtir_comentario'),
    path('categorias/<int:id>/', CategoriaView.as_view(), name='categoria-detalhe'),
]
