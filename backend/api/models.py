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
    status = models.BooleanField(default=True)
    idPerfilUser = models.OneToOneField('Perfil', on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['data_nascimento']

    objects = UsuarioManager()

class Perfil(models.Model):
    data_nascimento = models.DateField()
    cidade = models.CharField(max_length=100)
    qtd_propostas = models.IntegerField(default=0)
    qtd_comentarios = models.IntegerField(default=0)
    qtd_likes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.cidade} - {self.data_nascimento}"


class Conferencia(models.Model):
    titulo = models.TextField(default="Sem titulo")
    descricao = models.TextField()
    image_url = models.URLField(max_length=500,blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    data_subconferencia = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    perguntas = models.TextField(blank=True, null=True)
    respostas = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo


class Etapas(models.Model):
    titulo_etapa = models.CharField(max_length=500)
    descricao_etapa = models.TextField()
    status = models.CharField(max_length=50)
    regiao_etapa = models.CharField(default="não informado", max_length=250)
    duracao_etapa = models.CharField(max_length=100)
    qtd_propostas_etapa = models.IntegerField(default=0, null=True)
    qtd_inscritos_etapa = models.IntegerField(default=0, null=True)
    url_etapa = models.URLField(max_length=500, blank=True, null=True)
    propostas_relacionadas = models.TextField(blank=True, null=True)
    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo_etapa


class Planos(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)

    def __str__(self):
        return self.nome


class Consultas(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    sobre = models.TextField(blank=True, null=True)
    qtd_propostas = models.IntegerField(default=0)
    link = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.nome


class Propostas(models.Model):
    titulo_proposta = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    descricao_proposta = models.TextField()
    qtd_votos = models.IntegerField(default=0)
    url_proposta = models.URLField(blank=True, null=True)

    conferencia = models.ForeignKey(Conferencia, on_delete=models.CASCADE, null=True, blank=True)
    consulta = models.ForeignKey(Consultas, on_delete=models.CASCADE, null=True, blank=True)
    plano = models.ForeignKey(Planos, on_delete=models.CASCADE, null=True, blank=True)
    etapa = models.ForeignKey(Etapas, on_delete=models.SET_NULL, null=True, blank=True)  

    def __str__(self):
        return self.titulo_proposta


class Chat(models.Model):
    pergunta = models.TextField()
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pergunta


class Comentarios(models.Model):
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE)  
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.autor.nome} - {self.data_criacao}"


class Curtidas(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.ForeignKey(Comentarios, on_delete=models.CASCADE)
    curtido = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.usuario.nome} -> {self.comentario.id} | Curtido: {self.curtido}"
    
    
class Notification(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.user.username}: {self.message[:20]}'
