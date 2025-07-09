"""
URLs para a API do ParticipeMais.
"""

from django.urls import path
from .views import Home, DescubraView, PerguntasView, PesquisaGeralView, PesquisaListaTudo, FavoritosView, AgendaView

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('descubra/', DescubraView.as_view(), name='descubra_page'),
    path('descubra/pergunta', PerguntasView.as_view(), name='perguntas'),
    path('pesquisar/', PesquisaGeralView.as_view(), name='pesquisa-geral'),
    path('pesquisar/lista', PesquisaListaTudo.as_view(), name='pesquisa-lista'),
    path('favoritos/', FavoritosView.as_view(), name='favoritos'),
    path('agenda/', AgendaView.as_view(), name='agenda')
]
