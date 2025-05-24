from django.db import models
from django.conf import settings
from django.contrib.auth.models import User  # ?
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

## Cria o manager para o modelo Usuario
## O manager é responsável por criar e gerenciar os usuários

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Cria e retorna um usuário com um email e senha.
        """
        if not email:
            raise ValueError('O email deve ser definido')
        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)
        usuario.is_active = True 
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, senha=None, **extra_fields):
        """
        Cria e retorna um superusuário com um email e senha.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        return self.create_user(email, senha, **extra_fields)

class Usuario(AbstractBaseUser):
    nome = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    data_nascimento = models.DateField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['data_nascimento']

    objects = UsuarioManager()

class Conferencia(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    imagem_url = models.URLField(max_length=500)
    sobre = models.TextField()
    qtd_propostas = models.IntegerField()

    def __str__(self):
        return self.nome


class Etapa(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    regiao = models.CharField(max_length=255)
    status = models.CharField(max_length=100)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    qtd_propostas = models.IntegerField()
    qtd_inscritos = models.IntegerField()
    url_proposta_relacionada = models.URLField(max_length=500)
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE, related_name="etapas")

    def __str__(self):
        return self.titulo


class Proposta(models.Model):
    url = models.URLField(max_length=500)
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    autor_nome = models.CharField(max_length=255)
    qtd_votos = models.IntegerField()
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE, related_name="propostas")
    etapa = models.ForeignKey(Etapa, null=True, blank=True, on_delete=models.SET_NULL, related_name="propostas")

    def __str__(self):
        return self.titulo


class Comentario(models.Model):
    texto = models.TextField()
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    proposta = models.ForeignKey(Proposta, on_delete=models.CASCADE, related_name='comentarios')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.autor.username} comentou em {self.proposta.titulo}"


class Curtida(models.Model):
    comentario = models.ForeignKey(Comentario, on_delete=models.CASCADE, related_name='curtidas')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('comentario', 'usuario')

    def __str__(self):
        return f"{self.usuario.username} curtiu um comentário"


class PerguntaParticipativa(models.Model):
    texto = models.TextField()
    resposta = models.TextField()
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE, related_name="perguntas")

    def __str__(self):
        return self.texto[:50]