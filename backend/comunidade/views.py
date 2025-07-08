from django.db.models import Count, Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from .models import *
from .serializers import *
from propostas.models import Categoria
from propostas.serializers import CategoriaSerializer

class ScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]  
    
    def get(self, request):
        print("Usuário autenticado:", request.user)
        print("ID:", request.user.id)
        print("Nome:", request.user.nome)

        score_obj, created = UsuarioScore.objects.get_or_create(
            usuario=request.user,
            defaults={'pontos': 0}
        )
        
        return Response({
            'usuario': request.user.nome,
            'pontos': score_obj.pontos,
            'novo_registro': created
        }, status=status.HTTP_200_OK)

# lista e mostra quantidade perguntas/chat
class ComunidadeView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request):
        comunidades = Chat.objects.all().order_by('-data_criacao')
        comentarios = Comentarios.objects.all().order_by('-data_criacao')[:10]
        categorias = Categoria.objects.all()

        serializer = ComunidadeSerializer(comunidades, many=True)

        return Response({
            'quantidade_chat': comunidades.count(),
            'enquetes': serializer.data,
            "comentarios": ComentariosSerializer(comentarios, many=True, context={'request': request}).data,
            'categorias': CategoriaSerializer(categorias, many=True, context={'request': request}, fields=['id', 'nome']).data,
        }, status=status.HTTP_200_OK)


class CriarChat(APIView):
    permission_classes = [permissions.IsAuthenticated]    

    def post(self, request):
        serializer = ChatSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            chat = serializer.save()
            return Response({
                'message': 'Chat criado com sucesso!',
                'data': ChatSerializer(chat, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'errors': serializer.errors,
            'message': 'Erro ao cadastrar chat.'
        }, status=status.HTTP_400_BAD_REQUEST)

class ComentarioCarrossel(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        comentarios = Comentarios.objects.select_related('chat', 'autor').order_by('-data_criacao')[:10]
        serializer = ComentarioCarrosselSerializer(comentarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request, pk):
        try:
            chat = Chat.objects.get(pk=pk)
        except Chat.DoesNotExist:
            return Response({"error": "Chat não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ChatSerializer(chat, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK) 
        
    def post(self, request, pk):
        try:
            chat = Chat.objects.get(pk=pk)
        except Chat.DoesNotExist:
            return Response({'message': 'Chat não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ComentariosSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            comentario = serializer.save(autor=request.user, chat=chat)
            return Response({
                'message': 'Comentário criado com sucesso!',
                'data': ComentariosSerializer(comentario, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'errors': serializer.errors,
            'message': 'Erro ao cadastrar comentário.'
        }, status=status.HTTP_400_BAD_REQUEST)

class CurtidaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, chat_pk, comentario_pk):
        usuario = request.user
        
        try:
            comentario = Comentarios.objects.get(pk=comentario_pk, chat_id=chat_pk)
        except Comentarios.DoesNotExist:
            return Response({"error": "Comentário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        curtida, criado = Curtidas.objects.get_or_create(usuario=usuario, comentario=comentario)

        if not criado:
            curtida.curtido = not curtida.curtido
            curtida.save()

        quantidade_curtidas = Curtidas.objects.filter(comentario=comentario, curtido=True).count()

        return Response({
            "mensagem": "Curtida atualizada com sucesso.",
            "curtido": curtida.curtido,
            "quantidade_curtidas": quantidade_curtidas
        }, status=status.HTTP_200_OK)

class CategoriaView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        categoria = Categoria.objects.get(pk=id)
        
        conferencias = Conferencia.objects.filter(categorias=id)
        planos = Planos.objects.filter(categorias=id)
        consultas = Consultas.objects.filter(categorias=id)

        chats = Chat.objects.filter(categoria=id)
        comentarios = Comentarios.objects.filter(chat__categoria=id)[:10]
        lista_nuvem = categoria.nuvem_palavras.split(', ')[:12]

        return Response({
            "mensagem": "Categoria carregada com sucesso.",
            "titulo": categoria.nome,
            "conferencias": ConferenciaSerializer(conferencias, many=True).data,
            "planos": PlanoSerializer(planos, many=True).data,
            "consultas": ConsultaSerializer(consultas, many=True).data,
            "chats": [chat.id for chat in chats],
            "comentarios": ComentariosSerializer(comentarios, many=True).data,
            "lista_nuvem": lista_nuvem
        }, status=status.HTTP_200_OK)
