from django.db import models


class Topico(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome
    
class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    nuvem_palavras = models.CharField(max_length=1000, default="", blank=True)

    def __str__(self):
        return self.nome

class Propostas(models.Model):
    titulo_proposta = models.CharField(max_length=400)
    autor = models.CharField(max_length=100)
    descricao_proposta = models.TextField()
    qtd_votos = models.IntegerField(default=0)
    url_proposta = models.URLField(max_length=500, blank=True, null=True)

    conferencia = models.ForeignKey('conferencias.Conferencia', on_delete=models.CASCADE, null=True, blank=True)
    etapa = models.ForeignKey('conferencias.Etapas', on_delete=models.SET_NULL, null=True, blank=True)
    plano = models.ForeignKey('planos.Planos', on_delete=models.CASCADE, null=True, blank=True)
    consulta = models.ForeignKey('consultas.Consultas', on_delete=models.CASCADE, null=True, blank=True)
    categorias = models.ManyToManyField(Categoria, related_name='propostas', blank=True)


    def __str__(self):
        return self.titulo_proposta
    
class Palavras_chave(models.Model):
    proposta = models.ForeignKey(Propostas, on_delete=models.CASCADE, related_name='palavras_chave')
    palavras = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.proposta.titulo_proposta[:30]} - {self.palavras}"
