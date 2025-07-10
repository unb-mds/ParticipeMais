from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models import Usuario, Notification
from conferencias.models import Conferencia
from planos.models import Planos
from consultas.models import Consultas

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['cidade', 'qtd_propostas', 'qtd_comentarios', 'qtd_likes']
        read_only_fields = ['qtd_propostas', 'qtd_comentarios', 'qtd_likes']

class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True, required=True, label="Senha")
    senha2 = serializers.CharField(write_only=True, required=True, label="Confirmação da senha")

    conferencias = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Conferencia.objects.none(), required=False
    )
    planos = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Planos.objects.none(), required=False
    )
    consultas = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Consultas.objects.none(), required=False
    )

    idPerfilUser = PerfilSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'nome', 'email', 'data_nascimento', 'senha', 'senha2',
            'idPerfilUser', 'conferencias', 'planos', 'consultas'
        ]
        extra_kwargs = {
            'senha': {'write_only': True},
            'senha2': {'write_only': True},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['conferencias'].queryset = Conferencia.objects.all()
        self.fields['planos'].queryset = Planos.objects.all()
        self.fields['consultas'].queryset = Consultas.objects.all()

    def validate(self, data):
        email = data.get('email')
        if Usuario.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Este e-mail já está em uso."})
        
        if data.get('senha') != data.get('senha2'):
            raise serializers.ValidationError({"senha2": "As senhas não coincidem."})
        
        validate_password(data.get('senha'))
        return data

    def create(self, validated_data):
        conferencias = validated_data.pop('conferencias', [])
        planos = validated_data.pop('planos', [])
        consultas = validated_data.pop('consultas', [])
        senha = validated_data.pop('senha')
        validated_data.pop('senha2')

        usuario = Usuario(**validated_data)
        usuario.set_password(senha)
        usuario.save()

        usuario.conferencias.set(conferencias)
        usuario.planos.set(planos)
        usuario.consultas.set(consultas)

        return usuario


    def update(self, instance, validated_data):
        conferencias = validated_data.pop('conferencias', None)
        planos = validated_data.pop('planos', None)
        consultas = validated_data.pop('consultas', None)
        senha = validated_data.pop('password', None)

        if senha:
            instance.set_password(senha)
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
        
        

