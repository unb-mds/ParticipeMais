from rest_framework import serializers
from .models import Usuario
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

        return super().validate(attrs)
