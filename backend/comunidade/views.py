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
                defaults={'pontos': 0}  # Valor padrão para novos registros
            )
        
        return Response({
                'usuario': request.user.nome,
                'pontos': score_obj.pontos,
                'novo_registro': created  # Indica se foi criado um novo registro
            }, status=status.HTTP_200_OK)
        
#lista e mostra quantidade perguntas/chat
class ComunidadeView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    
    def get(self, request):
        
        comunidades = Chat.objects.annotate(
            total_curtidas=Count('comentarios__curtidas', filter=Q(comentarios__curtidas__curtido=True))
        ).order_by('-total_curtidas')

        categorias = list(Categoria.objects.order_by("?"))
        serializer = ComunidadeSerializer(comunidades, many = True).data
        comentarios = Comentarios.objects.order_by("?")[:10]
        
        return Response({
            'quantidade_chat': comunidades.count(),
            'Enquetes':serializer,
            "comentarios": ComentariosSerializer(comentarios, many=True).data,
            'categorias': CategoriaSerializer(categorias, many=True, context={'request': request},  fields=['id','nome']).data,
        }, status=status.HTTP_200_OK)
        
class CriarChat(APIView):
    permission_classes = [permissions.IsAuthenticated]    

    def post(self, request):
        serializer = ChatSerializer(data=request.data, context={'request': request})  # ⚠️ context aqui é essencial
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

#carrossel de para acessar chat atraves do comentarios
class ComentarioCarrossel(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        comentarios = Comentarios.objects.select_related('chat', 'autor').order_by('-data_criacao')[:10]
        serializer = ComentarioCarrosselSerializer(comentarios, many=True)
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
        
    def post(self, request, pk):  # recebe o id do chat via URL
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
            
#curte ou descurte comentario
class CurtidaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, chat_pk, comentario_pk):
        usuario = request.user
        
        try:
            comentario = Comentarios.objects.get(pk=comentario_pk, chat_id = chat_pk)
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


