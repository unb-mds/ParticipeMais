from rest_framework import serializers
from .models import *
from api.serializers import DynamicFieldsModelSerializer

palavras_proibidas = ["palavrão1", "palavrão2"]

class ComunidadeSerializer(serializers.ModelSerializer):
    
    quantidade_comentarios = serializers.SerializerMethodField()
    quantidade_curtidas = serializers.SerializerMethodField()

    
    class Meta:
        model = Chat
        fields = ['pergunta', 'quantidade_comentarios', 'quantidade_curtidas']
        
        
    def get_quantidade_comentarios(self, obj):
        return Comentarios.objects.filter(chat=obj).count()
    
    def get_quantidade_curtidas(self, obj):
        
        return Curtidas.objects.filter(comentario__chat=obj).count()

        
class ComentariosSerializer(serializers.ModelSerializer):
    
    quantidade_curtidas = serializers.SerializerMethodField()
    nome_autor = serializers.CharField(source='autor.nome', read_only=True)
  
    
    class Meta:
        model = Comentarios
        fields = '__all__'
    
    
    def get_quantidade_curtidas(self, obj):
        
        return Curtidas.objects.filter(comentario=obj).count()
        
        
    def validate(self, attrs):
        
        conteudo = attrs.get('conteudo', '').strip()
        
        if not conteudo:
            raise serializers.ValidationError("O comentário não pode estar vazio.")
        
        for palavra in palavras_proibidas:
            if palavra in conteudo.lower():
                raise serializers.ValidationError("O comentário contém conteúdo inadequado.")
        
        return super().validate(attrs)
    

class ComentarioCarrossel(serializers.ModelSerializer):
    autor_nome = serializers.CharField(source='autor.nome')
    pergunta = serializers.CharField(source='chat.pergunta')
    chat_id = serializers.IntegerField(source='chat.id')
    
    class Meta:
        model = Comentarios
        fields = ['id','conteudo', 'autor_nome', 'chat_id', 'pergunta' ]
        
        
class ChatSerializer(serializers.ModelSerializer):
    
    
    comentarios = ComentariosSerializer(many=True, read_only=True) 
    
    
    class Meta:
        model = Chat
        fields = '__all__'
        
    def validate(self, attrs):
        
        pergunta = attrs.get('pergunta', '').strip()
        
        if not pergunta:
            raise serializers.ValidationError("O comentário não pode estar vazio.")
        
        for palavra in palavras_proibidas:
            if palavra in pergunta.lower():
                raise serializers.ValidationError("O comentário contém conteúdo inadequado.")
        
        return super().validate(attrs)
        
        