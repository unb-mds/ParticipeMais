"""
Serializers para autenticação do ParticipeMais.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Usuario, Notification
from conferencias.models import Conferencia
from planos.models import Planos
from consultas.models import Consultas

class PerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Perfil.
    """
    class Meta:
        model = Usuario
        fields = ['cidade', 'qtd_propostas', 'qtd_comentarios', 'qtd_likes']
        read_only_fields = ['qtd_propostas', 'qtd_comentarios', 'qtd_likes']
class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Usuario.
    Serializa os campos básicos e trata a criação com senha criptografada.
    """
    conferencias = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Conferencia.objects.all(), required=False
    )
    planos = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Planos.objects.all(), required=False
    )
    consultas = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Consultas.objects.all(), required=False
    )
    idPerfilUser = PerfilSerializer(read_only=True)
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'data_nascimento', 'password', 'idPerfilUser','conferencias','planos','consultas']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Cria um novo usuário com senha criptografada.
        """
        conferencias = validated_data.pop('conferencias', [])
        planos = validated_data.pop('planos', [])
        consultas = validated_data.pop('consultas', [])
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password is not None:
            usuario.set_password(password)
            usuario.save()

        usuario.conferencias.set(conferencias)
        usuario.planos.set(planos)
        usuario.consultas.set(consultas)

        return usuario
    
    
    def update(self, instance, validated_data):
        conferencias = validated_data.pop('conferencias', None)
        planos = validated_data.pop('planos', None)
        consultas = validated_data.pop('consultas', None)
        password = validated_data.pop('password', None)
        if password is not None:
            instance.set_password(password)
            instance.save()

        if conferencias is not None:
            instance.conferencias.set(conferencias)
        if planos is not None:
            instance.planos.set(planos)
        if consultas is not None:
            instance.consultas.set(consultas)
            
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    """
    Serializer para login de usuário.
    """
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Valida o login do usuário com base no email e senha.
        """
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = Usuario.objects.get(email=email)
            if not user.check_password(password):
                raise serializers.ValidationError("Senha incorreta, tente novamente.")
        except Usuario.DoesNotExist as exc:
            raise serializers.ValidationError("Falha ao realizar o login, usuário não existe.") from exc
        attrs['user'] = user
        return attrs


class RequestEmailforResetPassword(serializers.Serializer):
    """
    Serializer para requisição de redefinição de senha via email.
    """
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        """
        Valida se o email existe no sistema.
        """
        email = attrs.get('email')
        user = Usuario.objects.filter(email=email)
        if not user.exists():
            raise serializers.ValidationError("Não existe nenhum usuário com esse email.")
        return attrs


class SetNewPasswordSerializer(serializers.Serializer):
    """
    Serializer para redefinir a senha do usuário.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    confirmpassword = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        """
        Valida se as senhas coincidem e seguem os critérios de segurança.
        """
        password = attrs.get('password')
        confirmpassword = attrs.get('confirmpassword')

        if confirmpassword != password:
            raise serializers.ValidationError("As senhas não coincidem.")
        validate_password(password)
        return attrs


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Notification.
    """
    class Meta:
        model = Notification
        fields = '__all__'
        
        

