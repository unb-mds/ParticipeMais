"""Views do módulo planos."""

from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

from .models import Planos
from .serializers import PlanosSerializer


# Rota para listar todos os planos existentes
class ListaPlanos(APIView):
    """Lista todos os planos disponíveis."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """GET para retornar todos os planos."""
        planos = Planos.objects.all().order_by('id') 
        serializer = PlanosSerializer(planos, many=True)

        return Response({
            'message': 'Rota protegida com sucesso!',
            'qtd_planos': planos.count(),
            'planos': serializer.data
        })


# Rota para acessar os dados de um plano específico
class AcessaPlano(APIView):
    """Acessa um plano pelo ID."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET para retornar um plano específico."""
        try:
            planos = Planos.objects.get(pk=pk)
        except Planos.DoesNotExist:
            return Response(
                {'error': 'Não existem planos para você ;-;'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        propostas = Propostas.objects.filter(plano=planos)[:250]
        propostas_serializer = PropostaSerializer(propostas, many=True, context={'request': request} )



        plano = PlanosSerializer(planos, context={'request': request})
        return Response({
            'message': 'Planos encontrados!',
            'data': {
                'conferencias': plano.data,
                'propostas': propostas_serializer.data,
            }
        })


# Rota para acessar as propostas associadas a um plano específico
class AcessaPropostasPlanos(APIView):
    """Lista propostas associadas a um plano."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        """GET para retornar propostas de um plano."""
        planos = Planos.objects.get(pk=pk)
        propostas = Propostas.objects.filter(plano=planos)
        serializer = PropostaSerializer(propostas, many=True)

        return Response({
            'planos': planos.nome,
            'total_propostas': propostas.count(),
            'propostas': serializer.data
        })


# Rota para acessar uma proposta específica dentro de um plano
class PropostaDiretaPlanos(APIView):
    """Acessa uma proposta específica dentro de um plano."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk, jk):
        """GET para retornar uma proposta específica."""
        planos = Planos.objects.get(pk=pk)
        propostas = Propostas.objects.filter(pk=jk, plano=planos)
        serializer = PropostaSerializer(propostas, many=True)

        return Response({
            'planos': planos.nome,
            'proposta': serializer.data
        })
