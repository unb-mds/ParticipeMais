
import pandas as pd
import os
import django

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from api.models import Conferencia, Etapas, Planos, Consultas, Propostas


# ==================== Conferencias ====================
df_conferencias = pd.read_csv('WebScraper/resultados/conferencias/conferenciass.csv')

for _, row in df_conferencias.iterrows():
    Conferencia.objects.get_or_create(
        titulo=row['Conferência'],
        descricao=row['Descrição Conferência'],
        image_url=row.get('Imagem Conferência', ''),
        sobre=row.get('Sobre Conferência', ''),
        data_subconferencia=row.get('Etapas') or None,
    )
print('Conferências importadas')


# ==================== Etapas ====================
df_etapas = pd.read_csv('WebScraper/resultados/conferencias/etapas.csv')

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
df_planos = pd.read_csv('WebScraper/resultados/planos/planos_dados.csv')

for _, row in df_planos.iterrows():
    Planos.objects.get_or_create(
        nome=row.iloc[0],          
        descricao=row.iloc[1],     
        image_url=row.iloc[2] if len(row) > 2 else '',
        sobre=row.iloc[3] if len(row) > 3 else '',
    )

print('Planos importados')



# # ==================== Consultas ====================

df_consultas1 = pd.read_csv('WebScraper/resultados/consultas/dados_consultas.csv')
df_consultas2 = pd.read_csv(
    'WebScraper/resultados/consultas/sobre_consultas.csv',
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
        print(f'Plano com nome "{nome}" não encontrado. Não foi possível adicionar o sobre.')

print('Consultas importadas com sucesso!')


# # ==================== Propostas ====================
# df_propostas = pd.read_csv('propostas.csv')

# for _, row in df_propostas.iterrows():
#     conferencia = Conferencia.objects.filter(titulo=row.get('conferencia')).first() if pd.notna(row.get('conferencia')) else None
#     consulta = Consultas.objects.filter(nome=row.get('consulta')).first() if pd.notna(row.get('consulta')) else None
#     plano = Planos.objects.filter(nome=row.get('plano')).first() if pd.notna(row.get('plano')) else None

#     Propostas.objects.get_or_create(
#         titulo_proposta=row['titulo_proposta'],
#         autor=row['autor'],
#         descricao_proposta=row['descricao_proposta'],
#         qtd_votos=int(row.get('qtd_votos', 0)),
#         url_proposta=row.get('url_proposta', ''),
#         conferencia=conferencia,
#         consulta=consulta,
#         plano=plano
#     )
# print('Propostas importadas')