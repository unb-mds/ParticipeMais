from django.db import models
from django.conf import settings
from autenticacao.models import Usuario

class Pergunta(models.Model):
    TIPO_CHOICES = [
        ('simnao', 'Sim ou Não'),
        ('multipla', 'Múltipla Escolha'),
    ]

    pergunta = models.TextField()
    categoria = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    
    def __str__(self):
        return self.pergunta

class PerguntaSimNao(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='pergunta_sim_nao')
    resposta_correta = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"[Sim/Não] {self.pergunta}"
        
class PerguntaMultipla(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='multipla_escolha')

    def __str__(self):
        return f"[Múltipla] {self.pergunta}"
    
class Alternativa(models.Model):
    pergunta = models.ForeignKey(PerguntaMultipla, on_delete=models.CASCADE, related_name='alternativas')
    conteudo = models.CharField(max_length=255)
    correta = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.conteudo} {'(correta)' if self.correta else ''}"



class Resposta(models.Model):
    usuario=models.ForeignKey(Usuario, on_delete=models.CASCADE)
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE)
    resposta_simples=models.ForeignKey(PerguntaSimNao, on_delete=models.CASCADE, null=True, blank=True)
    resposta_multipla=models.ForeignKey(Alternativa, on_delete=models.CASCADE,  null=True, blank=True)
    data_resposta = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together=['usuario', 'pergunta']