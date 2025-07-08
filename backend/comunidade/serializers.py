from rest_framework import serializers
from .models import Chat, Comentarios, Curtidas
from rest_framework import serializers
from conferencias.models import Conferencia
from planos.models import Planos
from consultas.models import Consultas

palavras_proibidas = ["palavrão1", "palavrão2"]


class ComunidadeSerializer(serializers.ModelSerializer):
    """Serializador para listar perguntas com contagem de comentários e curtidas."""

    quantidade_comentarios = serializers.SerializerMethodField()
    quantidade_curtidas = serializers.SerializerMethodField()

    class Meta:
        """
        Meta class para o serializador de comunidade.
        Define os campos a serem serializados e o modelo associado.
        """
        model = Chat
        fields = ['pergunta', 'quantidade_comentarios', 'quantidade_curtidas']

    def get_quantidade_comentarios(self, obj):
        """Retorna a quantidade de comentários relacionados a este chat."""
        return Comentarios.objects.filter(chat=obj).count()

    def get_quantidade_curtidas(self, obj):
        """Retorna a quantidade de curtidas em todos os comentários deste chat."""
        return Curtidas.objects.filter(comentario__chat=obj).count()


class ComentariosSerializer(serializers.ModelSerializer):
    """Serializador para comentários."""

    quantidade_curtidas = serializers.SerializerMethodField()
    nome_autor = serializers.CharField(source='autor.nome', read_only=True)
    autor_papel = serializers.SerializerMethodField()
    
    curtido = serializers.SerializerMethodField()
    
    class Meta:
        model = Comentarios
        fields = ['id', 'conteudo', 'data_criacao', 'quantidade_curtidas', 'nome_autor', 'autor_papel', 'curtido']
        read_only_fields = ['data_criacao', 'quantidade_curtidas', 'nome_autor']

    def get_quantidade_curtidas(self, obj):
        """Retorna a quantidade de curtidas no comentário."""
        return Curtidas.objects.filter(comentario=obj, curtido = True).count()
    
    
    def get_autor_papel(self, obj):
        """Retorna o nível do autor do comentário."""
        return obj.autor.usuarioscore.classificacao
        
        
    def get_curtido(self, obj):
        user = self.context['request'].user
        return Curtidas.objects.filter(usuario=user, comentario=obj, curtido=True).exists()

    def validate(self, attrs):
        """Valida o conteúdo do comentário."""
        conteudo = attrs.get('conteudo', '').strip()
        if not conteudo:
            raise serializers.ValidationError("O comentário não pode estar vazio.")
        for palavra in palavras_proibidas:
            if palavra in conteudo.lower():
                raise serializers.ValidationError("O comentário contém conteúdo inadequado.")
        return super().validate(attrs)

    def create(self, validated_data):
        """Associa o autor antes de criar o comentário."""
        validated_data['autor'] = self.context['request'].user
        return super().create(validated_data)


class ComentarioCarrosselSerializer(serializers.ModelSerializer):
    """Serializador simplificado de comentários para carrossel."""

    autor_nome = serializers.CharField(source='autor.nome')
    pergunta = serializers.CharField(source='chat.pergunta')
    chat_id = serializers.IntegerField(source='chat.id')

    class Meta:
        model = Comentarios
        fields = ['id', 'conteudo', 'autor_nome', 'chat_id', 'pergunta']


class ChatSerializer(serializers.ModelSerializer):
    comentarios = ComentariosSerializer(many=True, read_only=True)
    autor_nome = serializers.CharField(source='autor.nome', read_only=True)
    total_curtidas = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'pergunta', 'categoria', 'data_criacao', 'comentarios', 'autor_nome', 'total_curtidas']

    def get_total_curtidas(self, obj):
        return Curtidas.objects.filter(comentario__chat=obj, curtido=True).count()

    def validate(self, attrs):
        """Valida a pergunta."""
        pergunta = attrs.get('pergunta', '').strip()
        if not pergunta:
            raise serializers.ValidationError("A pergunta não pode estar vazia.")
        for palavra in palavras_proibidas:
            if palavra in pergunta.lower():
                raise serializers.ValidationError("A pergunta contém conteúdo inadequado.")
        return super().validate(attrs)

    def create(self, validated_data):
        """Associa o autor antes de criar a pergunta."""
        validated_data['autor'] = self.context['request'].user
        return super().create(validated_data)


class ConferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conferencia
        fields = ['id', 'image_url']  # adicione campos conforme necessário

class PlanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planos
        fields = ['id', 'image_url']  # adicione campos conforme necessário

class ConsultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultas
        fields = ['id', 'image_url']  # adicione campos conforme necessário

