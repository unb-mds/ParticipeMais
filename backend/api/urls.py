"""
URLs para a API do ParticipeMais.
"""

from django.urls import path
from .views import Home, DescubraView, PesquisaGeralView, PesquisaListaTudo, FavoritosView

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('descubra/', DescubraView.as_view(), name='descubra_page'),
    path('pesquisar/', PesquisaGeralView.as_view(), name='pesquisa-geral'),
    path('pesquisar/lista', PesquisaListaTudo.as_view(), name='pesquisa-lista'),
    path('favoritos/', FavoritosView.as_view(), name='favoritos')
]
