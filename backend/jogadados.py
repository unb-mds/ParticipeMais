
import pandas as pd
import os
import django
import re

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

# from api.models import Conferencia, Etapas, Planos, Consultas, Propostas, PerguntasParticipativas
from conferencias.models import Conferencia, Etapas, PerguntasParticipativas
from planos.models import Planos
from consultas.models import Consultas
from propostas.models import Propostas

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
    conferencia = Conferencia.objects.filter(titulo=row.iloc[0]).first() if pd.notna(row.iloc[0]) else None
    PerguntasParticipativas.objects.get_or_create(
        perguntas=row.iloc[1],
        respostas=row.iloc[2] if len(row) > 2 else '',
        conferencia=conferencia,
    )

df_conferencias3.fillna('', inplace=True)  

for _, row in df_conferencias3.iterrows():
    titulo = str(row['Conferência']).strip()
    descricao = str(row['Descrição Conferência']).strip().replace('\n', ' ').replace('\r', ' ')
    image = str(row.get('Imagem Conferência', '')).strip()

    Conferencia.objects.get_or_create(
        titulo=titulo,
        defaults={
            'descricao': descricao,
            'image_url': image,
        }
    )

print('Conferências importadas')


# ==================== Etapas ====================
df_etapas = pd.read_csv('../WebScraper/resultados/conferencias/etapas.csv')

for _, row in df_etapas.iterrows():
    for tamanho in row:

        if isinstance(tamanho,int):
            print(tamanho)
        else:
            print(len(tamanho))
    print("====================================================")

    conferencia = Conferencia.objects.filter(titulo=row['Conferência'].strip()).first()

    inscritos_raw = row.get('Inscritos Etapa', '0')
    if inscritos_raw == "Não informado" or pd.isna(inscritos_raw): #esse codigo e para jogar no banco de dados o zero para nao quebrar, porque nao informado eh uma string
        inscritos = -1
    else:
        try:
            inscritos = int(inscritos_raw)
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
        conferencia=conferencia,
    )

print('Etapas importadas')


# # ==================== Planos ====================
df_planos = pd.read_csv('../WebScraper/resultados/planos/planos_dados.csv')

for _, row in df_planos.iterrows():
    Planos.objects.get_or_create(
        nome=row.iloc[0],          
        descricao=row.iloc[1],     
        image_url=row.iloc[2] if len(row) > 2 else '',
        sobre=row.iloc[3] if len(row) > 3 else '',
    )

print('Planos importados')



# # ==================== Consultas ====================

df_consultas1 = pd.read_csv('../WebScraper/resultados/consultas/dados_consultas.csv')
df_consultas2 = pd.read_csv(
    '../WebScraper/resultados/consultas/sobre_consultas.csv',
    header=None,
    names=['Título Consulta', 'Sobre Consulta']
)

# Inserção dos dados básicos (nome, descricao, image_url, link)
for _, row in df_consultas1.iterrows():
    Consultas.objects.get_or_create(
        nome = row["Título Consulta"],
        descricao = row["Descrição Consulta"],
        image_url = row["URL da Imagem"],
        link = row["Link da Consulta"],
    )    


for _, row in df_consultas2.iterrows():
    nome = row.iloc[0]
    sobre = row.iloc[1] if len(row) > 1 else ''

    try:
        consulta = Consultas.objects.get(nome=nome.strip())
        consulta.sobre = sobre
        consulta.save()
    except Consultas.DoesNotExist:
        # print(f'Plano com nome "{nome}" não encontrado. Não foi possível adicionar o sobre.')
        print(f'')

print('Consultas importadas com sucesso!')


# # ==================== Propostas ====================
df_propostas_conferencias = pd.read_csv('../WebScraper/resultados/conferencias/propostas.csv')
df_propostas_planos = pd.read_csv('../WebScraper/resultados/planos/propostas_planos.csv')
df_propostas_planos2 = pd.read_csv('../WebScraper/resultados/planos/planos.csv')
df_propostas_consultas = pd.read_csv(
    '../WebScraper/resultados/consultas/proposta_consultas.csv',
    encoding='utf-8',
    lineterminator='\n'
)


for _, row in df_propostas_conferencias.iterrows():
    conferencia = Conferencia.objects.filter(titulo=row.get('Conferência')).first() if pd.notna(row.get('Conferência')) else None

    votos_str = str(row.get('Votos', '0'))
    votos_num = int(re.sub(r'\D', '', votos_str)) if re.sub(r'\D', '', votos_str) else 0

    Propostas.objects.get_or_create(
        titulo_proposta=row['Título Proposta'],
        autor=row['Autor'],
        descricao_proposta=row['Descrição Proposta'],
        qtd_votos=votos_num,
        url_proposta=row.get('Link', ''),
        conferencia=conferencia,
    )

for df in [df_propostas_planos, df_propostas_planos2]:
    for _, row in df.iterrows():
        nome_plano = row.get('Plano')
        if nome_plano == 'Não tem o titulo na página':
            nome_plano = 'Plano Clima Participativo'

        plano = Planos.objects.filter(nome=nome_plano).first() if pd.notna(nome_plano) else None

        votos_str = str(row.get('Votos', '0'))
        votos_num = int(re.sub(r'\D', '', votos_str)) if re.sub(r'\D', '', votos_str) else 0

        Propostas.objects.get_or_create(
            titulo_proposta=row['Título Proposta'],
            autor=row['Autor'],
            descricao_proposta=row['Descrição Proposta'],
            qtd_votos=votos_num,
            url_proposta=row.get('Link', ''),
            plano=plano
        )


df_propostas_consultas.fillna('', inplace=True)  

for _, row in df_propostas_consultas.iterrows():
    consulta_nome = str(row.get('Título Consulta')).strip()
    consulta = Consultas.objects.filter(nome=consulta_nome).first() if consulta_nome else None

    votos_str = str(row.get('qtd_votos', '0'))
    votos_num = int(re.sub(r'\D', '', votos_str)) if re.sub(r'\D', '', votos_str) else 0

    titulo_proposta = str(row.get('Título de Cada Proposta', '')).strip()
    autor = str(row.get('Autor da Proposta', '')).strip()

    descricao_proposta = str(row.get('Descrição da Proposta', '')).strip()
    descricao_proposta = descricao_proposta.replace('\n', ' ').replace('\r', ' ')

    Propostas.objects.get_or_create(
        titulo_proposta=titulo_proposta,
        autor=autor,
        descricao_proposta=descricao_proposta,
        qtd_votos=votos_num,
        consulta=consulta,
    )

print('Propostas importadas')

# caso dê erro ao localizar as pastas/arquivos csv só mude o endereço delas e xd, roda direitinho