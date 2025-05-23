from rest_framework import serializers
from .models import Usuario

#Cria o serializador para o modelo Usuario
#O serializador é responsável por converter os dados do modelo em um formato que pode ser facilmente convertido em JSON

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario

        fields = ['id', 'nome', 'email', 'data_nascimento', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        """
        Cria um novo usuário
        """

        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password is not None:
            # Criptografa a senha antes de salvar
            usuario.set_password(password)
            usuario.save()
            
        return usuario
    