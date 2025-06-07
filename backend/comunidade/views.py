from django.shortcuts import render
from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  viewsets, status, permissions, generics, filters
from .models import *
from serializers import *

class ScoreView(APIView):
    """
    View para consultar a pontuação do usuário.
    """
    permission_classes = [permissions.IsAuthenticated]  
    
    def get(self, request):
        score_obj, created = UsuarioScore.objects.get_or_create(usuario=request.user)
        return Response({
            'usuario': request.user.nome,
            'pontos': score_obj.pontos
        })
        
#lista e mostra quantidade perguntas/chat
class ComunidadeView(APIView):
    
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request):
        
        comunidades = Chat.objects.annotate(
            total_curtidas=Count('comentarios__curtidas', filter=Q(comentarios__curtidas__curtido=True))
        ).order_by('-total_curtidas')

        serializer = ComunidadeSerializer(comunidades, many = True).data
        
        return Response({
            'Quantidade Chat': comunidades.count(),
            'Enquetes':serializer
        }, status=status.HTTP_200_OK)
        
#carrossel de para acessar chat atraves do comentarios
class ComentarioCarrossel(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        comentarios = Comentarios.objects.select_related('chat', 'autor').order_by('-data_criacao')[:10]
        serializer = ComentarioCarrossel(comentarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# onde fica os comentarios de cada pergunta
class ChatView(APIView):
    
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request, pk):
        
        try:
            chat = Chat.objects.get(pk=pk)
        except Chat.DoesNotExist:
            return Response({"error": "Chat não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        
        serializer = ChatSerializer(chat)
        
        
        return Response(serializer.data, status=status.HTTP_200_OK)

        
        
    def post(self, request, pk):
        
        try:
            chat = Chat.objects.get(pk=pk)
        except Chat.DoesNotExist:
            return Response({"error": "Chat não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        
        serializer = ComentariosSerializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save(autor = request.user, chat = chat)
            
            return Response({
                "message": "Comentario feito com sucesso",
            }, status=status.HTTP_200_OK)
            
#curte ou descurte comentario
class CurtidaView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        usuario = request.user
        comentario = Comentarios.objects.filter(pk=pk)
        
        curtida, criado = Curtidas.objects.get_or_create(usuario=usuario, comentario=comentario)
       
        if not criado:
            curtida.curtido = not curtida.curtido
            curtida.save()

        return Response({
            "mensagem": "Curtida atualizada com sucesso.",
            "curtido": curtida.curtido,
            "quantidade_curtidas": Curtidas.objects.filter(comentario=comentario, curtido=True).count()
        }, status=status.HTTP_200_OK)
        
                    
            
    

