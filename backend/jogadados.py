"""
Este script importa dados de conferências, etapas, planos, consultas e propostas
para os modelos do Django a partir de arquivos CSV gerados pelo WebScraper.
"""

import os
import re
import django
import pandas as pd

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from conferencias.models import Conferencia, Etapas, PerguntasParticipativas
from planos.models import Planos, Oficinas
from consultas.models import Consultas
from propostas.models import Propostas





# ==================== Oficinas ====================

df_oficinass = pd.read_csv('../WebScraper/resultados/planos/oficinas.csv')

colunas = ["Plano", "Título Oficina", "Descricao Oficina", "Inscritos Oficina", "Regiao Oficina", "Status Oficina", "Data Oficina", "Propostas Oficina", "Quantidade Propostas Oficina",]  # Substitua pelos nomes reais que você espera
df_oficinas = pd.read_csv('../WebScraper/resultados/planos/oficinas.csv', header=None, names=colunas)


for _, row in df_oficinas.iterrows():
        nome = row.get('Plano')
        if nome == 'Conheça como foi o processo participativo do Novo Plano Nacional de Cultura':
            nome = 'Novo Plano Nacional de Cultura'


        plano = Planos.objects.filter(nome=nome).first() if pd.notna(nome) else None
        raw_inscritos = row.get('Inscritos Oficina', '0')
        if raw_inscritos == "Não informado" or pd.isna(raw_inscritos):
            inscritos = -1
        else:
            try:
                inscritos = int(raw_inscritos)
            except ValueError:
                inscritos = -1

        Oficinas.objects.get_or_create(
            titulo_oficina=row['Título Oficina'],
            descricao_oficina=row['Descricao Oficina'],
            status=row['Status Oficina'],
            regiao_oficina=row.get('Regiao Oficina', ''),
            duracao_oficina=row.get('Data Oficina', ''),
            qtd_propostas_oficina=row.get("Quantidade Propostas Oficina", 0),
            qtd_inscritos_oficina=inscritos,
            propostas_relacionadas=row.get('Propostas Oficina', ''),
            plano=plano,
        )

print('Oficinas importadas')



# ==================== Conferencias ====================
df_conferencias = pd.read_csv('../WebScraper/resultados/conferencias/conferenciass.csv')
df_conferencias2 = pd.read_csv('../WebScraper/resultados/conferencias/perguntas.csv')
df_conferencias3 = pd.read_csv(
    '../WebScraper/resultados/conferencias/encerradas.csv',
    encoding='utf-8',
    lineterminator='\n'
)

for _, row in df_conferencias.iterrows():
    Conferencia.objects.get_or_create(
        titulo=row['Conferência'],
        descricao=row['Descrição Conferência'],
        image_url=row.get('Imagem Conferência', ''),
        sobre=row.get('Sobre Conferência', ''),
        data_subconferencia=row.get('Etapas') or None,
    )

for _, row in df_conferencias2.iterrows():
    conf = Conferencia.objects.filter(titulo=row.iloc[0]).first() if pd.notna(row.iloc[0]) else None
    PerguntasParticipativas.objects.get_or_create(
        perguntas=row.iloc[1],
        respostas=row.iloc[2] if len(row) > 2 else '',
        conferencia=conf,
    )

df_conferencias3.fillna('', inplace=True)

for _, row in df_conferencias3.iterrows():
    titulo = str(row['Conferência']).strip()
    descricao = str(row['Descrição Conferência']).strip().replace('\n', ' ').replace('\r', ' ')
    imagem = str(row.get('Imagem Conferência', '')).strip()

    Conferencia.objects.get_or_create(
        titulo=titulo,
        defaults={
            'descricao': descricao,
            'image_url': imagem,
        }
    )

print('Conferências importadas')

# ==================== Etapas ====================
df_etapas = pd.read_csv('../WebScraper/resultados/conferencias/etapas.csv')

for _, row in df_etapas.iterrows():
    conf = Conferencia.objects.filter(titulo=row['Conferência'].strip()).first()
    raw_inscritos = row.get('Inscritos Etapa', '0')
    if raw_inscritos == "Não informado" or pd.isna(raw_inscritos):
        inscritos = -1
    else:
        try:
            inscritos = int(raw_inscritos)
        except ValueError:
            inscritos = -1

    Etapas.objects.get_or_create(
        titulo_etapa=row['Título Etapa'],
        descricao_etapa=row['Descricao Etapa'],
        status=row['Status Etapa'],
        regiao_etapa=row.get('Regiao Etapa', ''),
        duracao_etapa=row.get('Data Etapa', ''),
        qtd_propostas_etapa=row.get("Quantidade Propostas Etapa", 0),
        qtd_inscritos_etapa=inscritos,
        propostas_relacionadas=row.get('Propostas Etapa', ''),
        url_etapa=row["Url Etapa"],
        conferencia=conf,
    )

print('Etapas importadas')

# ==================== Planos ====================
df_planos = pd.read_csv('../WebScraper/resultados/planos/planos_dados.csv')

for _, row in df_planos.iterrows():
    Planos.objects.get_or_create(
        nome=row.iloc[0],
        descricao=row.iloc[1],
        image_url=row.iloc[2] if len(row) > 2 else '',
        sobre=row.iloc[3] if len(row) > 3 else '',
    )

print('Planos importados')

# ==================== Consultas ====================
df_consultas1 = pd.read_csv('../WebScraper/resultados/consultas/dados_consultas.csv')
df_consultas2 = pd.read_csv(
    '../WebScraper/resultados/consultas/sobre_consultas.csv',
    header=None,
    names=['Título Consulta', 'Sobre Consulta']
)

for _, row in df_consultas1.iterrows():
    Consultas.objects.get_or_create(
        nome=row["Título Consulta"],
        descricao=row["Descrição Consulta"],
        image_url=row["URL da Imagem"],
        link=row["Link da Consulta"],
    )

for _, row in df_consultas2.iterrows():
    nome = row.iloc[0]
    sobre = row.iloc[1] if len(row) > 1 else ''

    try:
        consulta = Consultas.objects.get(nome=nome.strip())
        consulta.sobre = sobre
        consulta.save()
    except Consultas.DoesNotExist:
        print(f'')

print('Consultas importadas com sucesso!')

# ==================== Propostas ====================
df_conf = pd.read_csv('../WebScraper/resultados/conferencias/propostas.csv')
df_planos1 = pd.read_csv('../WebScraper/resultados/planos/propostas_planos.csv')
df_planos2 = pd.read_csv('../WebScraper/resultados/planos/planos.csv')
df_consultas = pd.read_csv(
    '../WebScraper/resultados/consultas/proposta_consultas.csv',
    encoding='utf-8',
    lineterminator='\n'
)

for _, row in df_conf.iterrows():
    conf = Conferencia.objects.filter(titulo=row.get('Conferência')).first() if pd.notna(row.get('Conferência')) else None
    votos = int(re.sub(r'\D', '', str(row.get('Votos', '0')))) if re.sub(r'\D', '', str(row.get('Votos', '0'))) else 0

    Propostas.objects.get_or_create(
        titulo_proposta=row['Título Proposta'],
        autor=row['Autor'],
        descricao_proposta=row['Descrição Proposta'],
        qtd_votos=votos,
        url_proposta=row.get('Link', ''),
        conferencia=conf,
    )

for df in [df_planos1, df_planos2]:
    for _, row in df.iterrows():
        nome = row.get('Plano')
        if nome == 'Não tem o titulo na página':
            nome = 'Plano Clima Participativo'
        if nome == 'Conheça como foi o processo participativo do Novo Plano Nacional de Cultura':
            nome = 'Novo Plano Nacional de Cultura'

        plano = Planos.objects.filter(nome=nome).first() if pd.notna(nome) else None
        votos = int(re.sub(r'\D', '', str(row.get('Votos', '0')))) if re.sub(r'\D', '', str(row.get('Votos', '0'))) else 0

        Propostas.objects.get_or_create(
            titulo_proposta=row['Título Proposta'],
            autor=row['Autor'],
            descricao_proposta=row['Descrição Proposta'],
            qtd_votos=votos,
            url_proposta=row.get('Link', ''),
            plano=plano
        )

df_consultas.fillna('', inplace=True)

for _, row in df_consultas.iterrows():
    nome = str(row.get('Título Consulta')).strip()
    consulta = Consultas.objects.filter(nome=nome).first() if nome else None
    votos = int(re.sub(r'\D', '', str(row.get('qtd_votos', '0')))) if re.sub(r'\D', '', str(row.get('qtd_votos', '0'))) else 0

    titulo = str(row.get('Título de Cada Proposta', '')).strip()
    autor = str(row.get('Autor da Proposta', '')).strip()
    desc = str(row.get('Descrição da Proposta', '')).strip().replace('\n', ' ').replace('\r', ' ')

    Propostas.objects.get_or_create(
        titulo_proposta=titulo,
        autor=autor,
        descricao_proposta=desc,
        qtd_votos=votos,
        consulta=consulta,
    )

print('Propostas importadas')
