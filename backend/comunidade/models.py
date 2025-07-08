from django.db import models
from django.conf import settings
from autenticacao.models import Usuario

class Chat(models.Model):
    pergunta = models.TextField()
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    categoria = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pergunta

class Comentarios(models.Model):
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='comentarios')
    def __str__(self):
        return f"{self.autor.nome} - {self.data_criacao}"

class Curtidas(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.ForeignKey(Comentarios, on_delete=models.CASCADE)
    curtido = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.usuario.nome} -> {self.comentario.id} | Curtido: {self.curtido}"
    
    class Meta:
        unique_together = ('usuario', 'comentario')
        
class UsuarioScore(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nivel = models.IntegerField(default=1)
    classificacao = models.CharField(max_length=100, default="Nível 1: Iniciante Cívico")
    pontos = models.IntegerField(default=0)
    
    def atualizar_nivel(self):
        """Atualiza o nível e classificação com base nos pontos."""
        if self.pontos >= 1000:
            self.nivel = 5
            self.classificacao = "Nível 5: Mestre Cívico"
        elif self.pontos >= 700:
            self.nivel = 4
            self.classificacao = "Nível 4: Líder Comunitário"
        elif self.pontos >= 400:
            self.nivel = 3
            self.classificacao = "Nível 3: Colaborador Ativo"
        elif self.pontos >= 200:
            self.nivel = 2
            self.classificacao = "Nível 2: Participante Engajado"
        else:
            self.nivel = 1
            self.classificacao = "Nível 1: Iniciante Cívico"

        self.save()

    