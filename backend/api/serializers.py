from rest_framework import serializers
from .models import *
from django.contrib.auth.tokens import PasswordResetTokenGenerator # gera tokens seguross
from django.utils.encoding import force_bytes 
from django.utils.http import urlsafe_base64_encode # converter o user.pk em uma string segura para URL.
from django.contrib.auth.password_validation import validate_password

#Cria o serializador para o modelo Usuario

#O serializador é responsável por converter os dados do 
# models em um formato que pode ser facilmente convertido em JSON 
# para que a nossa API possa acessar os dados

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario

        fields = ['id', 'nome', 'email', 'data_nascimento', 'password']
        extra_kwargs = {'password': {'write_only': True}} 
        
    def create(self, validated_data):
        #criar um novo usuário

        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password is not None:
            # Criptografa a senha antes de salvar
            usuario.set_password(password)
            usuario.save()
            
        return usuario
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
        
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
            
        try:
            user = Usuario.objects.get(email=email) #pega o usuario que tem o mesmo email q foi dado
            if not user.check_password(password): #retorna um bool se bater a senha com a senha (se der erro manda o erro de serializer para ser lido na views)
                raise serializers.ValidationError("Senha Incorreta, tente novamente")
        except Usuario.DoesNotExist: #se nn existir usuario com esse email ou senha manda esse erro serializer
            raise serializers.ValidationError("Falha ao realizar o login, usuário não existe")
            
        attrs['user'] = user #retorna o user
        return attrs
    
class RequestEmailforResetPassword(serializers.Serializer):
    email=serializers.EmailField(min_length=2) #campo obrigatório

    class Meta:
        fields = ['email']

        def validate(self, attrs):
            email = attrs.get('email') #attrs pega os dados do input

            try:
                user = Usuario.objects.filter(email=email)
            except Usuario.DoesNotExist:
                raise serializers.ValidationError("Não existe nenhum usuário com esse email.")

            return attrs
        

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirmpassword = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):

        password = attrs.get('password')
        confirmpassword = attrs.get('confirmpassword')

        if confirmpassword != password:
            raise serializers.ValidationError("As senhas não batem")
            
        validate_password(password)

        return attrs 
    
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Um ModelSerializer que aceita um argumento 'fields' para limitar os campos.
    """
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)  # Pega os campos desejados
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Remove os campos que não estão na lista
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class PropostaSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Proposta
        fields = '__all__'
        

class EtapaSerializer(serializers.ModelSerializer):
    
    propostas = PropostaSerializer(many=True, read_only=True)
    class Meta:
        model = Etapa
        fields = ['id', 'titulo', 'descricao', 'regiao', 'propostas', 'status', 'data_inicio', 'data_fim', 'qtd_propostas', 'qtd_inscritos', 'url_proposta_relacionada', 'conferencia']

class ConferenciaSerializer(DynamicFieldsModelSerializer):
    propostas = PropostaSerializer(many=True, read_only=True)
    etapas = EtapaSerializer(many=True, read_only=True)
    class Meta:
        model = Conferencia
        fields = '__all__'
        

class PesquisaSerializer(serializers.ModelSerializer):
    """
    Serializador para a view PesquisaView.
    """
    class Meta:
        model = Conferencia
        fields = ['id', 'nome', 'descricao', 'imagem_url', 'sobre', 'qtd_propostas']
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at']

