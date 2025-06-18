"""
Views para a API do ParticipeMais.
"""

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from conferencias.models import Conferencia
from conferencias.serializers import ConferenciaSerializer
from planos.models import Planos
from planos.serializers import PlanosSerializer
from consultas.models import Consultas
from consultas.serializers import ConsultasSerializer
from propostas.models import Propostas
from propostas.serializers import PropostaSerializer


class Home(APIView):
    """
    View para rota inicial protegida.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna mensagem de autenticação e email do usuário.
        """
        return Response({"message": "Você está logado!", "user": request.user.email})

class DescubraView(APIView):
    
    permission_classes = [permissions.AllowAny] 
    """
    View para exibir itens aleatórios de cada categoria.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Retorna 5 conferências, planos e consultas aleatórias, e 10 propostas aleatórias.
        """
        conferencias = list(getattr(Conferencia, "objects").order_by('?'))[:5]
        planos = list(getattr(Planos, "objects").order_by('?'))[:5]
        consultas = list(getattr(Consultas, "objects").order_by('?'))[:5]
        propostas = list(getattr(Propostas, "objects").order_by('?'))[:10]

        data = {
            'conferencias': ConferenciaSerializer(
                conferencias, many=True, fields=['image_url']
            ).data,
            'planos': PlanosSerializer(
                planos, many=True, fields=['image_url']
            ).data,
            'consultas': ConsultasSerializer(
                consultas, many=True, fields=['image_url']
            ).data,
            'propostas': PropostaSerializer(
                propostas,
                many=True,
                fields=[
                    'titulo_proposta',
                    'descricao_proposta',
                    'autor',
                    'url_proposta',
                    'palavras_chave'
                ]
            ).data
        }

        return Response({
            'message': 'Rota protegida com sucesso!',
            'data': data
        })

class ConferenciaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar conferências.
    """
    queryset = getattr(Conferencia, "objects").all()
    serializer_class = ConferenciaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['titulo', 'descricao']

class PlanosViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar planos.
    """
    queryset = getattr(Planos, "objects").all()
    serializer_class = PlanosSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nome', 'descricao']

class ConsultasViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar consultas.
    """
    queryset = getattr(Consultas, "objects").all()
    serializer_class = ConsultasSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nome', 'descricao']

class PesquisaGeralView(APIView):
    """
    View para pesquisa geral nas entidades.
    Para funcionar, use a rota: ?q=conteudo
    Exemplo: api/pesquisar/?q=meio
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Pesquisa por termo nas entidades conferencias, planos e consultas.
        """
        query = request.query_params.get('q', '')

        conferencias = (
            getattr(Conferencia, "objects").filter(titulo__icontains=query) |
            getattr(Conferencia, "objects").filter(descricao__icontains=query)
        )
        planos = (
            getattr(Planos, "objects").filter(nome__icontains=query) |
            getattr(Planos, "objects").filter(descricao__icontains=query)
        )
        consultas = (
            getattr(Consultas, "objects").filter(nome__icontains=query) |
            getattr(Consultas, "objects").filter(descricao__icontains=query)
        )

        return Response({
                'conferencias': ConferenciaSerializer(conferencias, many=True).data,
                'planos': PlanosSerializer(planos, many=True).data,
                'consultas': ConsultasSerializer(consultas, many=True).data
             }, status=status.HTTP_200_OK)
       
class PesquisaListaTudo(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        conferencia = list(Conferencia.objects.order_by('?'))
        planos = list(Planos.objects.order_by('?'))
        consultas = list(Consultas.objects.order_by('?'))

        data = {
            'conferencias': ConferenciaSerializer(conferencia, context={'request': request}, many=True, fields=['id','image_url','titulo']).data,  
            'planos': PlanosSerializer(planos, many=True, context={'request': request}, fields=['id','image_url','nome']).data,
            'consultas': ConsultasSerializer(consultas, many=True, context={'request': request},  fields=['id','image_url','nome']).data,
        }
        
        return Response({
                'message': 'Rota protegida com sucesso!',
                'data': data
            })

class FavoritosView(APIView):
    """
    View para gerenciar favoritos do usuário.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Lista as propostas favoritas do usuário.
        """
        usuario = request.user
        favoritos = usuario.favoritos.all()
        data = PropostaSerializer(favoritos, many=True, context={'request': request}).data

        return Response({'favoritas': data}, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Adiciona uma proposta aos favoritos do usuário.
        """
    
        usuario = request.user
        proposta_id = request.data.get('proposta_id')
        if not proposta_id:
            return Response({'message': 'proposta_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            proposta = Propostas.objects.get(id=proposta_id)
        except Propostas.DoesNotExist:
            return Response({'message': 'Proposta não encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        usuario.favoritos.add(proposta)
        return Response({'message': 'Proposta adicionada aos favoritos!'}, status=status.HTTP_200_OK)

    def delete(self, request):
        """
        Remove uma proposta dos favoritos do usuário.
        """
        usuario = request.user
        proposta_id = request.data.get('proposta_id')
        if not proposta_id:
            return Response({'message': 'proposta_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            proposta = Propostas.objects.get(id=proposta_id)
        except Propostas.DoesNotExist:
            return Response({'message': 'Proposta não encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        usuario.favoritos.remove(proposta)
        return Response({'message': 'Proposta removida dos favoritos!'}, status=status.HTTP_200_OK)
