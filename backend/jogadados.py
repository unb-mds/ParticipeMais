
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
# df_planos = pd.read_csv('planos.csv')

# for _, row in df_planos.iterrows():
#     Planos.objects.get_or_create(
#         nome=row['nome'],
#         descricao=row['descricao'],
#         image_url=row.get('image_url', ''),
#         sobre=row.get('sobre', ''),
#         qtd_propostas=int(row.get('qtd_propostas', 0))
#     )
# print('Planos importados')



# # ==================== Consultas ====================

df_consultas = pd.read_csv('WebScraper/resultados/consultas/dados_consultas.csv')




for _, row in df_consultas.iterrows():
    titulo_original = row['Título Consulta']
    nome_final = TITULO_REPLACEMENTS.get(titulo_original, titulo_original)
    link = TITULO_LINK_MAP.get(titulo_original, '')

    if pd.isna(nome_final) or nome_final == '':
        print('Nome vazio encontrado. Pulando...')
        continue  # pula para a próxima linha

    consulta, created = Consultas.objects.get_or_create(
        nome=nome_final,
        defaults={
            'descricao': row['Descrição Consulta'],
            'link': link
        }
    )

for _, row2 in df_consultas_2.iterrows():
    titulo_original = row2['Título Consulta']
    nome_final = TITULO_REPLACEMENTS.get(titulo_original, titulo_original)

    if pd.isna(nome_final) or nome_final == '':
        print('Nome vazio encontrado no segundo dataframe. Pulando...')
        continue

    try:
        consulta = Consultas.objects.get(nome=nome_final)
        consulta.image_url = row2.get('URL da Imagem', '')
        consulta.sobre = row2.get('Sobre Consulta', '')
        consulta.save()
    except Consultas.DoesNotExist:
        print(f'Consulta com nome "{nome_final}" não encontrada para atualizar.')

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