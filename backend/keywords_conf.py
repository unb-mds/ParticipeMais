import os
import re
import django
from pathlib import Path

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')  # Altere para seu projeto real
django.setup()

from conferencias.models import Conferencia
from planos.models import Planos
from consultas.models import Consultas


conferencias = {
    1: {
        "palavras_chave": ["ambiente", "aquecimento", "causadores", "climática", "climáticas", "ecológica", "emergência", "emissões", "extremos", "governança", "intensos", "mudanças", "nacional", "participativa", "reduzimos", "resiliente", "transformação", "vulnerável"],
        "palavras_relevantes": ["climática", "ecológica", "governança", "resiliente", "transformação", "participativa"]
    },
    2: {
        "palavras_chave": [],
        "palavras_relevantes": []
    },
    3: {
        "palavras_chave": ["agricultura", "brasileiro", "conselho", "construir", "desenvolvimento", "familiar", "florestas", "ministério", "nacional", "objetivo","participação", "propostas", "sustentável"],
        "palavras_relevantes": ["agricultura", "familiar", "florestas", "sustentável", "desenvolvimento", "propostas"]
    },
    4: {
        "palavras_chave": ["conferência", "continuidade", "democracia", "discutirão", "formulação", "igualdade", "oportunidade", "políticas", "protagonismo", "públicas", "reforcem", "reparação", "retomada", "sociedade"],
        "palavras_relevantes": ["democracia", "igualdade", "políticas", "públicas", "sociedade"]
    },
    5: {
        "palavras_chave": ["articulação", "avaliação", "brasília", "coletivas", "conadipi", "conferência", "conferências", "convocou", "democráticos", "dezembro", "direitos", "diretrizes", "discussão", "distrito", "específicos", "estratégias", "formulações", "instâncias", "interesse", "nacionais", "nacional", "participação", "políticas", "portaria", "propostas", "públicas", "realizada", "reflexão", "representantes", "sociedade", "voltados"],
        "palavras_relevantes": ["direitos", "diretrizes", "estratégias", "participação", "políticas", "públicas"]
    },
    6: {
        "palavras_chave": ["caminhos", "coletivamente", "conferência", "conselho", "construiremos", "democráticas", "desenvolvimento", "discutir", "entusiasmo", "inclusivas", "ministério", "nacional", "política", "processo", "sustentáveis", "trilharemos"],
        "palavras_relevantes": ["democráticas", "desenvolvimento", "inclusivas", "sustentáveis", "política"]
    },
    7: {
        "palavras_chave": ["alimentar", "brasília", "conferência", "conselho", "democracia", "dezembro", "direitos", "encerrada", "equidade", "erradicar", "garantir", "histórico", "nacional", "nutricional", "possibilitando", "presença", "presidente", "realizada", "reinstalado", "segurança"],
        "palavras_relevantes": ["alimentar", "democracia", "equidade", "nutricional", "segurança"]
    },
    8: {
        "palavras_chave": ["brasileirasinscrição", "cerimônia", "cidadania", "cultural", "democracia", "dezembro", "discutir", "dividida", "encerrada", "encerramento", "encontro", "encontros", "estrangeiras", "estruturada", "eventuais", "inscreva", "inscrição", "inscrições", "integração", "mercosul", "ministerial", "momentos", "participar", "participação", "preenchimento", "programação", "reabertas", "remanescentes", "sociedade", "temáticos"],
        "palavras_relevantes": ["cidadania", "cultural", "democracia", "integração", "sociedade"]
    },
    9: {
        "palavras_chave": ["brasilparticipativo", "brasília", "cadastrar", "conferência", "conferências", "conselheiros", "dezembro", "digitalgov", "estaduais", "juventude", "municipais", "nacional", "plataforma", "programada"],
        "palavras_relevantes": ["juventude", "conferência", "conselheiros", "plataforma", "estaduais", "municipais"]
    }
}


planos = {
    1: {
        "palavras_chave": ["aconteceram", "artesanais", "artesanal", "construir", "consulta", "gestoras", "gestores", "nacional", "participar", "participação", "pescadoras", "pescadores", "pesquisadoras", "pesquisadores", "plenárias", "públicos", "queremos", "regionais"],
        "palavras_relevantes": ["gestoras", "gestores", "pescadoras", "pescadores", "participação", "públicos"]
    },
    2: {
        "palavras_chave": ["construir", "milhares", "ministério", "nacional", "políticas", "propostas", "próximos", "públicas"],
        "palavras_relevantes": ["políticas", "propostas", "públicas"]
    },
    3: {
        "palavras_chave": [],
        "palavras_relevantes": []
    },
    4: {
        "palavras_chave": ["desafios", "desenvolvimento", "empresas", "envolvendo", "estratégia", "estratégico", "impactos", "instrumento", "orientará", "pensando", "planejamento", "presente", "sociedade", "soluções", "universidades"],
        "palavras_relevantes": ["desafios", "desenvolvimento", "estratégia", "planejamento", "sociedade", "universidades"]
    },
    5: {
        "palavras_chave": ["adaptação", "atingidas", "calamidade", "centenas", "climático", "desastre", "deslizamentos", "emergencial", "emergência", "empresas", "enfrentamento", "enxurradas", "extensos", "extremos", "histórias", "infraestrutura", "inundações", "inéditos", "milhares", "mitigação", "municípios", "necessidade", "necessárias", "paisagens", "perdidas", "políticas", "preparação", "públicas", "reconstrução", "recordes", "resposta", "rupturas", "seminário", "sociedade"],
        "palavras_relevantes": ["adaptação", "emergência", "infraestrutura", "mitigação", "reconstrução", "políticas", "sociedade"]
    },
    6: {
        "palavras_chave": [],
        "palavras_relevantes": []
    },
    7: {
        "palavras_chave": [],
        "palavras_relevantes": []
    },
    8: {
        "palavras_chave": ["administração", "anualmente", "avaliado", "congressistas", "congresso", "contemplando", "continuada", "daquelas", "decorrentes", "despesas", "diretrizes", "elaboração", "encerramento", "estabelecido", "executivo", "instrumento", "investimentos", "nacional", "objetivos", "orçamentária", "orçamentárias", "orçamentário", "planejamento", "plurianual", "posteriormente", "presidente", "primeiro", "principal", "programas", "prolonga", "relativas", "república", "responsável", "sancionado", "sucessor", "vigência"],
        "palavras_relevantes": ["orçamentária", "programas", "instrumento", "planejamento", "diretrizes", "investimentos"]
    }
}

consultas = {
    1: {
        "palavras_chave": ["ampliação", "aperfeiçoar", "asustentabilidade", "atransparênciae", "autorizatárias", "benefícios", "cadastrados", "cidadãos", "coletivo", "compartilhamento", "compartilhar", "compatibilizar", "compromisso", "concessionárias", "concessão", "consulta", "crescimento", "dainfraestrutura", "deaperfeiçoar", "despesas", "destinando", "detentoras", "direitos", "direitose", "distribuição", "doecossistema", "endereço", "especial", "especialmente", "finalidade", "funcionamento", "importante", "iniciativa", "inovação", "interesse", "manutenção", "ministério", "nacional", "objetivam", "pagamento", "permissionárias", "pessoais", "portaria", "presente", "prestadoras", "privacidade", "processo", "programas", "proteção", "práticas", "públicos", "regulamentação", "relacionadas", "relacionado", "requisitos", "seguridade", "serviços", "telecomunicação", "tratando", "verificação"],
        "palavras_relevantes": ["direitos", "benefícios", "privacidade", "proteção", "regulamentação", "programas", "interesse"]
    },
    2: {
        "palavras_chave": ["abordará", "alinhados", "andanças", "atuantes", "competências", "comunidades", "conjunto", "consolidar", "constituição", "construir", "consulta", "contribuições", "culminando", "cultural", "democrática", "detentores", "diagnósticos", "difundir", "diretrizes", "discussão", "discutidos", "discutir", "disponível", "documentos", "especialmente", "estabelecer", "estudantes", "fazedores", "formulações", "fundamentais", "gestores", "governos", "importante", "incluindo", "inclusiva", "institucionalização", "integrados", "limitações", "mobilizar", "nacional", "objetivo", "oficinas", "oportunidade", "organizações", "parceiros", "participantes", "participar", "participativa", "participativo", "participação", "participou", "patrimônio", "percorrendo", "pesquisadores", "plataforma", "políticas", "possível", "presenciais", "preservar", "preservação", "principais", "privadas", "privados", "processo", "profissionais", "promover", "públicas", "queremos", "realizar", "realização", "regulatório", "representativa", "responsabilidades", "reunindo", "rolezinho", "salvaguarda", "segmentos", "setorial", "sociedade", "território", "trabalhadores"],
        "palavras_relevantes": ["constituição", "democrática", "diretrizes", "políticas", "participação", "sociedade", "preservação"]
    },
    3: {
        "palavras_chave": ["consolidar", "democracia", "direitos", "garantia", "resistir", "retrocessos"],
        "palavras_relevantes": ["democracia", "direitos", "garantia", "resistir"]
    },
    4: {
        "palavras_chave": ["colaboração", "construir", "contamos", "contexto", "contribuirão", "credenciais", "eficiente", "estaduais", "formulário", "fortalecendo", "gestores", "governadores", "importantes", "informações", "municipais", "municípios", "objetivo", "orientar", "participativa", "participativo", "participação", "participe", "plataforma", "prefeitos", "próximos", "responder", "respostas"],
        "palavras_relevantes": ["colaboração", "fortalecendo", "gestores", "governadores", "participação", "plataforma"]
    },
    5: {
        "palavras_chave": ["administração", "agradecemos", "aprovadas", "atendendo", "autárquica", "barramento", "biometricamente", "biométricas", "biométrico", "cadastrais", "carteira", "conjunto", "considerando", "construção", "consulta", "contamos", "convidamos", "elaborada", "executiva", "fortalecendo", "fundacional", "identidade", "identificar", "identificação", "inequívoca", "instituir", "instituição", "interesse", "interoperabilidade", "nacional", "naturais", "necessidade", "operações", "participarem", "participação", "políticas", "possibilitar", "privados", "procedimentos", "processo", "proposta", "públicas", "qualidade", "relações", "relevante", "requerentes", "requisitos", "resolução", "segurança", "serviços", "verificar", "verificação"],
        "palavras_relevantes": ["identificação", "instituição", "segurança", "interoperabilidade", "participação", "políticas"]
    },
    6: {
        "palavras_chave": ["abrangência", "compostos", "distrital", "distrito", "educação", "entidades", "estadual", "finalidade", "instituídos", "mobilizar", "movimentos", "organizar", "participação", "políticas", "portaria", "públicas", "sociedade", "territórios"],
        "palavras_relevantes": ["educação", "mobilizar", "participação", "políticas", "sociedade", "territórios"]
    },
    7: {
        "palavras_chave": ["comunicação", "consensual", "dezembro", "formulações", "instituído", "nacional", "novembro", "participação", "portaria", "proposta", "regulamentado", "responsabilidade", "restabelecer", "resultado", "sociedade", "trabalho"],
        "palavras_relevantes": ["comunicação", "regulamentado", "participação", "responsabilidade", "sociedade"]
    },
    8: {
        "palavras_chave": ["aderentes", "afroturismo", "alcançar", "ancestralidade", "articulação", "brasileira", "brasileiranacional", "brasileiro", "circularpara", "coletivos", "compromisso", "comunidades", "constitui", "construção", "consulta", "consumidores", "contribuir", "contribuição", "convidamos", "criativa", "deexperiências", "desenvolvimento", "direcionadas", "diversas", "enfrentamento", "envolvendo", "estruturado", "experiências", "federados", "federativos", "finalidade", "fomentados", "fomentar", "fundamentais", "fundamental", "igualdade", "imaterial", "impactar", "incentivo", "inserida", "instituições", "internacionalmente", "invisibilizada", "majoritária", "material", "minimizada", "nacional", "naeconomia", "negraspretende", "negrastem", "oprograma", "participarem", "patrimônio", "população", "positivamente", "potencial", "processo", "produtiva", "produtos", "produção", "programa", "promoção", "protagonismo", "publicidades", "quaisquer", "qualificar", "relacionados", "representada", "representatividade", "roteiros", "serviços", "sustentabilidade", "territórios", "turístico", "turísticos", "turísticosrelacionados", "valorização", "àcultura"],
        "palavras_relevantes": ["afroturismo", "ancestralidade", "igualdade", "inserida", "sustentabilidade", "representatividade", "valorização"]
    },
    9: {
        "palavras_chave": ["atividades", "autogestionadas", "coletadas", "consulta", "contribuições", "culturais", "declaração", "discussões", "disponível", "entregue", "incorporadas", "milhares", "novembro", "participantes", "participação", "plataforma", "português", "presidente", "processo", "realizada", "realizadas"],
        "palavras_relevantes": ["consulta", "contribuições", "culturais", "participação", "plataforma", "discussões"]
    },
    10: {
        "palavras_chave": ["completo", "construção", "consulta", "contribuições", "diversas", "encontrado", "estratégia", "estratégicos", "finalizamos", "fundamentais", "importante", "incluindo", "incorporadas", "informar", "iniciativas", "instituem", "napágina", "objetivos", "participativo", "plataforma", "portaria", "princípios", "realizada", "resultado", "sociedade", "sugestões", "trabalho", "valiosas"],
        "palavras_relevantes": ["estratégia", "contribuições", "participativo", "objetivos", "sociedade", "trabalho"]
    },
    11: {
        "palavras_chave": ["acelerar", "aconteceram", "administração", "agradecemos", "amplitude", "articular", "buscaram", "cidadãos", "colaborarem", "colaborativa", "colaborações", "coletando", "comentando", "comentários", "considerando", "considerarem", "construção", "consulta", "contamos", "contribuições", "convidamos", "deixando", "desigualdades", "diretrizes", "dispositivos", "diversidade", "diversos", "dodecretoque", "empresas", "entrevistas", "especialistas", "estabelecerá", "estaduais", "estratégia", "federativa", "finalidades", "fundamentais", "governos", "iniciativas", "inovação", "instituições", "interesse", "internacionais", "lançando", "melhoria", "ministério", "municipais", "municípios", "nacionais", "nacional", "nasrecomendaçõesque", "navegarem", "oficinas", "organizações", "orientadoras", "parceria", "participativas", "participativo", "participação", "passando", "plataforma", "população", "potencializar", "presenciais", "prevista", "prioridades", "privadas", "processamento", "processo", "públicas", "públicos", "realizadas", "realizado", "recomendações", "regionais", "relevantes", "reuniram", "servirão", "serviços", "setembro", "sociedade", "transformação", "trouxeram"],
        "palavras_relevantes": ["consulta", "contribuições", "diretrizes", "estratégia", "participativo", "recomendações", "sociedade"]
    }
}


# Atualizar Conferencias
for id_, data in conferencias.items():
    try:
        obj = Conferencia.objects.get(id=id_)
        palavras = data.get("palavras_chave", [])
        obj.palavras_chaves = ", ".join(palavras)
        obj.save()
        print(f"Conferência {id_} atualizada com {len(palavras)} palavras-chave.")
    except Conferencia.DoesNotExist:
        print(f"Conferência {id_} não encontrada.")

# Atualizar Planos
for id_, data in planos.items():
    try:
        obj = Planos.objects.get(id=id_)
        palavras = data.get("palavras_chave", [])
        obj.palavras_chaves = ", ".join(palavras)
        obj.save()
        print(f"Plano {id_} atualizado com {len(palavras)} palavras-chave.")
    except Planos.DoesNotExist:
        print(f"Plano {id_} não encontrado.")

# Atualizar Consultas
for id_, data in consultas.items():
    try:
        obj = Consultas.objects.get(id=id_)
        palavras = data.get("palavras_chave", [])
        obj.palavras_chaves = ", ".join(palavras)
        obj.save()
        print(f"Consulta {id_} atualizada com {len(palavras)} palavras-chave.")
    except Consultas.DoesNotExist:
        print(f"Consulta {id_} não encontrada.")