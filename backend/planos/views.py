"""Views do módulo planos."""

from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response

from propostas.models import Propostas
from propostas.serializers import PropostaSerializer

from .models import Planos, Oficinas
from .serializers import PlanosSerializer, Oficinas_serializer
from autenticacao.models import Usuario  

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
        
        oficinas = Oficinas.objects.filter(plano=planos)[:250]
        oficinas_serializer = Oficinas_serializer(oficinas, many=True, context={'request': request})

        plano = PlanosSerializer(planos, context={'request': request})
        return Response({
            'message': 'Planos encontrados!',
            'data': {
                'planos': plano.data,
                'propostas': propostas_serializer.data,
                'oficinas': oficinas_serializer.data
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


class TogglePlanosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, planos_id):
        try:
            plano = Planos.objects.get(id=planos_id)
        except Planos.DoesNotExist:
            return Response({'message': 'Plano não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if plano in user.planos.all():
            user.planos.remove(plano)  # ✅ corrigido
            return Response({'message': 'Plano removido dos favoritos.'})
        else:
            user.planos.add(plano)  # ✅ corrigido
            return Response({'message': 'Plano adicionado aos favoritos.'})



class PlanosFavoritasView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        favoritos = user.planos.values_list('id', flat=True)
        return Response({'favoritos': list(favoritos)})