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

import unicodedata

CATEGORIAS = {
     "Direito das Mulheres": [
        "igualdade de gênero", "igualdade de genero", "interseccionalidade", "autonomia das mulheres",
        "políticas públicas mulheres", "politicas publicas mulheres", "diversidade", "mulheres", "feminino",
        "direitos das mulheres", "empoderamento feminino", "violência contra mulheres", "assédio sexual",
        "discriminação de gênero", "equidade de gênero", "movimento feminista", "saúde da mulher",
        "participação feminina", "representatividade feminina", "direito reprodutivo"
    ],
    "Igualdade Racial": [
        "igualdade racial", "justiça racial", "população negra", "populacao negra", "quilombolas",
        "matriz africana", "comunidades tradicionais", "povos de terreiro", "reparação", "reparacao",
        "racismo estrutural", "discriminação racial", "direitos raciais", "políticas afirmativas",
        "ação afirmativa", "diversidade racial", "inclusão racial", "combate ao racismo",
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
        "agricultura familiar", "campo", "florestas", "floresta", "águas", "aguas", "território", "territorio",
        "bem viver", "brasil rural", "agroecologia", "solo", "agricultura", "ecológica", "ecologica",
        "produção rural", "agricultura sustentável", "pequenos produtores", "zona rural",
        "desenvolvimento sustentável rural", "reforma agrária", "comunidades rurais",
        "segurança alimentar", "agroflorestal", "produção agrícola", "agrofloresta"
    ],
    "Meio Ambiente": [
        "sustentabilidade", "florestas", "floresta", "território", "agrofloresta", "territorio", "natureza", "ecologia",
        "co2", "CO2", "arborização", "arborizacao", "água", "agua","bioma", "sementes", "solo", "meio ambiente","ambientais"
        "hídrico", "hidrico", "ecológica", "ecologica","renovaveis", "clima", "ambiental", "climatica", "climaticas",
        "biodiversidade", "poluição", "reciclagem", "conservação ambiental", "preservação ambiental",
        "desmatamento", "recursos naturais", "energia renovável", "recursos hídricos", "políticas ambientais"
    ],
    "Participação Social": [
        "conferência livre", "conferencia livre", "protagonismo", "sociedade civil", "votação online",
        "votacao online", "escuta ativa", "participação social", "participacao social", "consulta pública",
        "consulta publica", "movimento social", "mobilização social", "controle social",
        "engajamento comunitário", "democracia participativa", "fórum social", "assembleia comunitária"
    ],
    "Saúde": [
        "saúde da pessoa idosa", "saude da pessoa idosa", "cuidado integral", "proteção à vida",
        "protecao a vida", "autonomia", "abandono social", "atenção integral", "atencao integral",
        "direito à saúde", "direito a saude", "saúde pública", "promoção da saúde", "atenção básica",
        "assistência médica", "serviços de saúde", "prevenção de doenças", "bem-estar",
        "doenças crônicas", "saúde mental", "acesso à saúde", "acesso a saude", "vigilância em saúde"
    ],
    "Educação": [
        "educação", "ensino", "escola", "escolas", "professor", "professores", "aprendizagem", "formação", "capacitação", 
        "alfabetização", "letramento","pedagogia", "currículo", "educacional", "escolar", "educar", "educandos",
        "inclusão escolar", "educação infantil", "educação básica", "educação superior", "educação técnica", 
        "educação profissional","educação pública", "educação a distância", "ensino fundamental",
        "ensino médio", "ensino superior", "educação especial", "educação para jovens e adultos","programa educacional", "política educacional", 
        "avaliação escolar","desempenho escolar", "qualidade da educação", "recursos pedagógicos",
        "escolas públicas", "educação inclusiva"
        ],
    "Infraestrutura": [
        "infraestrutura", "infraestrutura urbana", "infraestrutura rural", "infraestrutura de transporte",
        "mobilidade urbana", "mobilidade sustentável", "transporte público", "energia elétrica", "energia eletrica",
        "rede elétrica", "rede eletrica", "abastecimento de água", "abastecimento de agua",
        "saneamento básico", "saneamento ambiental", "esgotamento sanitário", "esgotamento sanitario",
        "iluminação pública", "iluminacao publica", "vias públicas", "vias publicas", "rodovias", "ferrovias",
        "portos", "aeroportos", "drenagem urbana", "drenagem pluvial", "rede de gás", "rede de gas",
        "infraestrutura crítica", "infraestrutura de comunicação", "redes viárias", "rede viária",
        "logística urbana", "conservação urbana", "infraestrutura digital", "planejamento urbano",
    ],
    "Tecnologia": [
        "tecnologia", "tecnologias", "inovação", "inovacao", "transformação digital",
        "transformacao digital", "digitalização", "digitalizacao", "conectividade", "internet",
        "banda larga", "telecomunicações", "telecomunicacoes", "telefonia móvel", "telefonia movel",
        "fibra ótica", "fibra otica", "tecnologia da informação", "tecnologia da informacao", "TI",
        "sistemas de informação", "sistemas de informacao", "automação", "automacao", "indústria 4.0",
        "industria 4.0", "smart cities", "cidades inteligentes", "dados abertos", "big data",
        "inteligência artificial", "inteligencia artificial", "IA", "internet das coisas",
        "internet of things", "IoT", "segurança da informação", "segurança da informacao",
        "blockchain", "computação em nuvem", "computacao em nuvem", "software", "hardware",
        "rede de dados", "redes de dados", "cibersegurança", "ciberseguranca", "computação quântica",
        "computacao quantica", "machine learning", "aprendizado de máquina", "aprendizado de maquina",
        "robótica", "robotica", "realidade aumentada", "realidade virtual", "realidade misturada",
        "internet banda larga", "infraestrutura tecnológica", "infraestrutura tecnologica",
        "plataformas digitais", "dispositivos móveis", "dispositivos moveis", "automação industrial",
    ]


}


def normalize_text(text):
    """
    Converte texto para lowercase e remove acentuação.
    """
    text = text.lower()
    text = unicodedata.normalize('NFD', text)
    text = ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn')  # remove acentos
    return text


def identificar_categoria_mais_relevante(texto):
    texto_norm = normalize_text(texto)
    contagem = {}

    for nome_categoria, palavras in CATEGORIAS.items():
        contagem[nome_categoria] = 0

        for palavra in palavras:
            palavra_norm = normalize_text(palavra)
            if len(palavra_norm) < 3:
                continue
            
            pattern = r'\b' + re.escape(palavra_norm) + r's?\b'

            if re.search(pattern, texto_norm):
                contagem[nome_categoria] += 1

    categoria_escolhida = max(contagem.items(), key=lambda item: item[1])[0]

    if contagem[categoria_escolhida] == 0:
        return None  # Nenhuma categoria encontrada
    return categoria_escolhida


def linkar_categoria_unica(model_class):
    for item in model_class.objects.all():
        if not item.sobre:
            print(f"{model_class.__name__} {item.id} ignorado: campo 'sobre' vazio.")
            continue

        categoria_nome = identificar_categoria_mais_relevante(item.sobre)

        if not categoria_nome:
            print(f"Nenhuma categoria detectada para '{item.id}'")
            continue

        try:
            categoria = Categoria.objects.get(nome=categoria_nome)
        except Categoria.DoesNotExist:
            print(f"Categoria '{categoria_nome}' não encontrada no banco.")
            continue

        item.categoria = categoria
        item.save()

        print(f"{model_class.__name__} {item.id} categorizado como: {categoria.nome}")



linkar_categoria_unica(Conferencia)
linkar_categoria_unica(Consultas)
linkar_categoria_unica(Planos)