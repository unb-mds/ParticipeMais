"""
Este script importa dados de conferências, etapas, planos, consultas e propostas
para os modelos do Django a partir de arquivos CSV gerados pelo WebScraper.
"""

import os
import re
import django
import pandas as pd
from pathlib import Path

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from conferencias.models import Conferencia, Etapas, PerguntasParticipativas
from planos.models import Planos
from consultas.models import Consultas
from propostas.models import Propostas, Categoria



BASE_DIR = Path(__file__).resolve().parent

# ==================== Conferências ====================
df_conferencias = pd.read_csv(BASE_DIR / '../WebScraper/resultados/conferencias/conferenciass.csv')
df_conferencias2 = pd.read_csv(BASE_DIR / '../WebScraper/resultados/conferencias/perguntas.csv')
df_conferencias3 = pd.read_csv(
    BASE_DIR / '../WebScraper/resultados/conferencias/encerradas.csv',
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
df_etapas = pd.read_csv(BASE_DIR/'../WebScraper/resultados/conferencias/etapas.csv')

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
df_planos = pd.read_csv(BASE_DIR/'../WebScraper/resultados/planos/planos_dados.csv')

for _, row in df_planos.iterrows():
    Planos.objects.get_or_create(
        nome=row.iloc[0],
        descricao=row.iloc[1],
        image_url=row.iloc[2] if len(row) > 2 else '',
        sobre=row.iloc[3] if len(row) > 3 else '',
    )

print('Planos importados')

# ==================== Consultas ====================
df_consultas1 = pd.read_csv(BASE_DIR/'../WebScraper/resultados/consultas/dados_consultas.csv')
df_consultas2 = pd.read_csv(
   BASE_DIR/'../WebScraper/resultados/consultas/sobre_consultas.csv',
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
df_conf = pd.read_csv(BASE_DIR/'../WebScraper/resultados/conferencias/propostas.csv')
df_planos1 = pd.read_csv(BASE_DIR/'../WebScraper/resultados/planos/propostas_planos.csv')
df_planos2 = pd.read_csv(BASE_DIR/'../WebScraper/resultados/planos/planos.csv')
df_consultas = pd.read_csv(
    BASE_DIR/'../WebScraper/resultados/consultas/proposta_consultas.csv',
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

categorias = {
     "Direito das Mulheres": [
        "igualdade de gênero", "interseccionalidade", "autonomia das mulheres",
        "políticas públicas mulheres", "diversidade", "mulheres", "feminino",
        "direitos das mulheres", "empoderamento feminino", "violência contra mulheres",
        "discriminação de gênero", "equidade de gênero", "movimento feminista", "saúde da mulher",
        "participação feminina", "representatividade feminina", "direito reprodutivo"
    ],
    "Igualdade Racial": [
        "igualdade racial", "justiça racial", "populacao negra", "quilombolas",
        "matriz africana", "comunidades tradicionais", "povos de terreiro", "reparação", "reparacao",
        "racismo estrutural", "discriminação racial", "direitos raciais", "políticas afirmativas",
        "acao afirmativa", "diversidade racial", "inclusao racial", "combate ao racismo",
        "cotas raciais", "etnias", "identidade racial"
    ],
    "Direitos da Pessoa Idosa": [
        "envelhecimento", "pessoa idosa", "idosos", "velhice", "cuidados",
        "violência contra idosos", "violencia contra idosos", "conselho da pessoa idosa",
        "direitos do idoso", "proteção ao idoso", "assistência ao idoso", "idosos vulneráveis",
        "terceira idade", "longevidade", "inclusão do idoso", "qualidade de vida do idoso",
        "políticas para idosos", "saúde do idoso"
    ],
    "Desenvolvimento Rural": [
        "agricultura familiar", "campo", "floresta", "águas",  "território",
        "bem viver", "brasil rural", "agroecologia", "solo", "agricultura", "ecológica",
        "produção rural", "agricultura sustentável", "pequenos produtores", "zona rural",
        "desenvolvimento sustentável rural", "reforma agrária", "comunidades rurais",
        "segurança alimentar", "agroflorestal", "produção agrícola",
    ],
    "Meio Ambiente": [
        "sustentabilidade", "florestas",  "território", "agrofloresta", "natureza", "ecologia",
         "CO2", "arborização",  "água", "bioma", "sementes", "solo", "meio ambiente","ambientais"
        "hídrico",  "ecológica","renovaveis", "clima", "ambiental", "climatica", 
        "biodiversidade", "poluição", "reciclagem", "conservação ambiental", "preservação ambiental",
        "desmatamento", "recursos naturais", "energia renovável", "recursos hídricos", "políticas ambientais"
    ],
    "Participação Social": [
        "conferencia livre", "protagonismo", "sociedade civil",
        "votacao online", "escuta ativa", "participacao social", "consulta pública",
        "consulta publica", "movimento social", "mobilização social", "controle social",
        "engajamento comunitário", "democracia participativa", "fórum social", "assembleia comunitária"
    ],
    "Saúde": [
        "saúde da pessoa idosa", "cuidado integral", "proteção à vida",
       "autonomia", "abandono social", "atenção integral", "atencao integral",
        "direito à saúde", "saúde pública", "promoção da saúde", "atenção básica",
        "assistência médica", "serviços de saúde", "prevenção de doenças", "bem-estar",
        "doenças crônicas", "saúde mental", "acesso à saúde",  "vigilância em saúde"
    ],
    "Educação": [
        "educação", "ensino", "escola",  "professor","aprendizagem", "formação", "capacitação", 
        "alfabetização", "letramento","pedagogia", "currículo", "educacional", "educar",
        "inclusão escolar", "educação infantil", "educação básica", "educação superior", "educação técnica", 
        "educação profissional","educação pública", "educação a distância", "ensino fundamental",
        "ensino médio", "ensino superior", "educação especial", "educação para jovens e adultos","programa educacional", "política educacional", 
        "avaliação escolar","desempenho escolar", "qualidade da educação", "recursos pedagógicos",
        "escolas públicas", "educação inclusiva"
        ],
    "Infraestrutura": [
        "infraestrutura", "urbana", "rural", "transporte",
        "mobilidade urbana", "mobilidade sustentável", "transporte público", "energia elétrica", "energia eletrica",
        "rede elétrica", "rede eletrica", "abastecimento de água", "abastecimento de agua",
        "saneamento básico", "saneamento ambiental", "esgotamento sanitário", "esgotamento sanitario",
        "iluminação pública", "iluminacao publica", "vias públicas", "vias publicas", "rodovias", "ferrovias",
        "portos", "aeroportos", "drenagem urbana", "drenagem pluvial", "rede de gás", "rede de gas",
        "infraestrutura crítica", "infraestrutura de comunicação", "redes viárias", "rede viária",
        "logística urbana", "conservação urbana", "infraestrutura digital", "planejamento urbano",
    ],
    "Tecnologia": [
        "tecnologia","inovacao", 
        "transformacao digital", "digitalizacao", "conectividade", "internet",
        "banda larga", "telecomunicacoes", "telefonia movel",
        "fibra otica", "tecnologia da informacao", "TI",
        "sistemas de informacao","automacao",
        "industria 4.0", "smart cities", "cidades inteligentes", "dados abertos", "big data",
        "inteligencia artificial", "IA", "internet das coisas",
        "internet of things", "IoT", "segurança da informacao",
        "blockchain", "computacao em nuvem", "software", "hardware",
        "rede de dados", "redes de dados", "ciberseguranca", 
        "computacao quantica", "machine learning", "aprendizado de máquina", "aprendizado de maquina",
        "robotica", "realidade aumentada", "realidade virtual", "realidade misturada",
        "internet banda larga", "infraestrutura tecnológica", "infraestrutura tecnologica",
        "plataformas digitais", "dispositivos moveis", "automação industrial",
    ]
}
for nome_categoria, palavras in categorias.items():
    # Remove duplicatas e espaços extras
    palavras_limpa = [p.strip() for p in set(palavras)]
    # Junta tudo em uma string separada por vírgulas
    nuvem = ', '.join(palavras_limpa)
    
    # Corta se ultrapassar 1000 caracteres
    if len(nuvem) > 1000:
        print(f"Atenção: Categoria '{nome_categoria}' excedeu o limite de 1000 caracteres e será cortada.")
        nuvem = nuvem[:997] + "..."

    # Cria ou atualiza o objeto
    obj, created = Categoria.objects.update_or_create(
        nome=nome_categoria,
        defaults={'nuvem_palavras': nuvem}
    )
    print(f"{'Criado' if created else 'Atualizado'}: {obj.nome}")
print('Propostas importadas')