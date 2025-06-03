from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email deve ser definido')
        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)
        usuario.is_active = True
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, senha=None, **extra_fields):
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
    
class Notification(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'Notification for {self.usuario.email}: {self.message[:20]}'
