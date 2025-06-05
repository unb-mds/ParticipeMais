from django.urls import path
from .views import Home, DescubraView, PesquisaGeralView

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('descubra/', DescubraView.as_view(), name='descubra_page'),
    path('pesquisar/', PesquisaGeralView.as_view(), name='pesquisa-geral'),
]
