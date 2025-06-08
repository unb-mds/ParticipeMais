from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import  viewsets, status, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *

from conferencias.models import Conferencia
from planos.models import Planos
from consultas.models import Consultas
from propostas.models import Propostas

from conferencias.serializers import ConferenciaSerializer
from planos.serializers import PlanosSerializer
from consultas.serializers import ConsultasSerializer
from propostas.serializers import PropostaSerializer

class Home(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message": "Você está logado!", "user": request.user.email})


class DescubraView(APIView):
    
    permission_classes = [permissions.IsAuthenticated] 
    #essa view só pode ser acessada por usuários autenticados

    def get(self, request):
        
        conferencia = list(Conferencia.objects.order_by('?'))[:5]
        planos = list(Planos.objects.order_by('?'))[:5]
        consultas = list(Consultas.objects.order_by('?')[:5])
        # mostrar 5 conferencias, planos ou consultas aleatorias
        
        proposta = list(Propostas.objects.order_by('?'))[:10]
        # mostrar 10 propostas aleatorias
        
        # antes era usado o random.shuffle(conferencia) mas não é necessário pois o order_by já deixa de forma aleatória 
        
        data = {
            'conferencias': ConferenciaSerializer(conferencia, many=True, fields=['image_url']).data,  
            'planos': PlanosSerializer(planos, many=True, fields=['image_url']).data,
            'consultas': ConsultasSerializer(consultas, many=True, fields=['image_url']).data,
            'propostas': PropostaSerializer(proposta, many=True, fields=['titulo_proposta', 'descricao_proposta', 'autor', 'url_proposta']).data
        }
        
        return Response({
                'message': 'Rota protegida com sucesso!',
                'data': data
            })
        
class ConferenciaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Conferencia.objects.all()
    serializer_class = ConferenciaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['titulo', 'descricao']

class PlanosViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Planos.objects.all()
    serializer_class = PlanosSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nome', 'descricao']

class ConsultasViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Consultas.objects.all()
    serializer_class = ConsultasSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nome', 'descricao']

class PesquisaGeralView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    """
    para funcionar digite na rota ?q=conteudo que vc quer
    por exemplo quero pesquisar por "meio", logo api/pesquisar/?q=meio
    """
    
    def get(self, request):
        query = request.query_params.get('q','')
        
        conferencias = Conferencia.objects.filter(titulo__icontains=query) | Conferencia.objects.filter(descricao__icontains=query)
        planos = Planos.objects.filter(nome__icontains=query) | Planos.objects.filter(descricao__icontains=query)
        consultas = Consultas.objects.filter(nome__icontains=query) | Consultas.objects.filter(descricao__icontains=query)    
        
        #filter_backends = [DjangoFilterBackend, filters.SearchFilter]
        #filterset_fields = ['nome'] #Filtra registros que correspondem exatamente ao valor passado.
        #search_fields = ['titulo', 'descricao']  # Procura pelo termo em qualquer lugar dos campos configurados.
        
        return Response({
                'conferencias': ConferenciaSerializer(conferencias, many=True).data,
                'planos': PlanosSerializer(planos, many=True).data,
                'consultas': ConsultasSerializer(consultas, many=True).data
             }, status=status.HTTP_200_OK)
       
