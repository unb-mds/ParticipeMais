"""
Modelos para autenticação do ParticipeMais.
"""

from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UsuarioManager(BaseUserManager):
    """
    Manager customizado para o modelo Usuario.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Cria e salva um usuário com o email e senha fornecidos.
        """
        if not email:
            raise ValueError('O email deve ser definido')
        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)
        usuario.is_active = True
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Cria e salva um superusuário.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser):
    """
    Modelo customizado de usuário.
    """
    nome = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    data_nascimento = models.DateField()
    favoritos = models.ManyToManyField('propostas.Propostas', blank=True, related_name='favoritas')
    status = models.BooleanField(default=True)
    idPerfilUser = models.OneToOneField('Perfil', on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['data_nascimento']
    objects = UsuarioManager()

class Perfil(models.Model):
    """
    Perfil do usuário.
    """
    data_nascimento = models.DateField()
    cidade = models.CharField(max_length=100)
    qtd_propostas = models.IntegerField(default=0)
    qtd_comentarios = models.IntegerField(default=0)
    qtd_likes = models.IntegerField(default=0)

    def __str__(self):
        """
        Retorna representação textual do perfil.
        """
        return f"{self.cidade} - {self.data_nascimento}"

class Notification(models.Model):
    """
    Notificações para o usuário.
    """
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Retorna representação textual da notificação.
        """
        usuario_email = getattr(self.usuario, 'email', 'Usuário')
        return f'Notification for {usuario_email}: {str(self.message)[:20]}'
