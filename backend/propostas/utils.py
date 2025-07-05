from keybert import KeyBERT
from .models import Propostas, Palavras_chave

kw_model = KeyBERT(model='distilbert-base-nli-mean-tokens')

def gerar_palavras_chave(top_n=5):
    total_processadas = 0
    total_puladas = 0
    total_keywords_salvas = 0

    propostas = Propostas.objects.all()
    print(f"[INFO] Iniciando extração de palavras-chave para {propostas.count()} propostas...")

    for proposta in propostas:
        if proposta.palavras_chave.exists():
            print(f"[SKIP] Proposta '{proposta.titulo_proposta}' já possui palavras-chave.")
            total_puladas += 1
            continue

        texto = proposta.descricao_proposta
        print(f"[PROCESSANDO] Extraindo palavras-chave para: '{proposta.titulo_proposta}'")

        try:
            keywords = kw_model.extract_keywords(texto, top_n=top_n)
        except Exception as e:
            print(f"[ERRO] Falha ao extrair palavras-chave da proposta '{proposta.titulo_proposta}': {e}")
            continue

        if not keywords:
            print(f"[AVISO] Nenhuma palavra-chave extraída para: '{proposta.titulo_proposta}'")
            continue

        for kw, _ in keywords:
            Palavras_chave.objects.create(
                proposta=proposta,
                palavras=kw
            )
            print(f"  [+] Palavra-chave salva: {kw}")
            total_keywords_salvas += 1

        total_processadas += 1

    print("\n[RESUMO]")
    print(f"  Propostas processadas: {total_processadas}")
    print(f"  Propostas puladas (já tinham keywords): {total_puladas}")
    print(f"  Palavras-chave salvas: {total_keywords_salvas}")
    print("[FINALIZADO]")
