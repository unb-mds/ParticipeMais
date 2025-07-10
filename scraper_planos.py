from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup, NavigableString, Tag
import time, re
import requests
import csv
import os


options = Options()
# options.headless = True  # ativar se quiser rodar em segundo plano

driver = webdriver.Firefox(options=options)
wait = WebDriverWait(driver, 20)
driver.get("https://brasilparticipativo.presidencia.gov.br/")

secoes_desejadas = ["Planos"]

if not os.path.exists("propostas_planos.csv"):
    with open("propostas_planos.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Plano", "Quantidade Propostas",
            "Título Proposta", "Descrição Proposta", "Link", "Votos", "Autor"
        ])
        writer.writeheader()

# if not os.path.exists("planos_dados.csv"):
#     with open("conferenciass.csv", mode="w", newline="", encoding="utf-8") as f:
#         writer = csv.DictWriter(f, fieldnames=[
#                 "Plano", 
#                 "Descrição Plano", 
#                 "Imagem Plano", 
#                 "Sobre Plano",
#             ])
#         writer.writeheader()  

contador = 0
paginas_visitadas = set()
propostas_acessadas = set()

wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "section-card")))
cards = driver.find_elements(By.CLASS_NAME, "section-card")

cards_filtrados = []
titulos_filtrados = []

for card in cards:
    try:
        titulo = card.find_element(By.CLASS_NAME, "section-card-title").text.strip()
        if titulo in secoes_desejadas:
            cards_filtrados.append(card)
            titulos_filtrados.append(titulo)
    except:
        continue

for i in range(len(cards_filtrados)):
    driver.get("https://brasilparticipativo.presidencia.gov.br/")
    wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "section-card")))
    time.sleep(1)

    cards = driver.find_elements(By.CLASS_NAME, "section-card")
    cards_filtrados = []
    for card in cards:
        try:
            titulo = card.find_element(By.CLASS_NAME, "section-card-title").text.strip()
            if titulo in secoes_desejadas:
                cards_filtrados.append(card)
        except:
            continue

    card = cards_filtrados[i]
    titulo_secao = titulos_filtrados[i]
    print(f"Entrando em {titulo_secao}")

    driver.execute_script("arguments[0].scrollIntoView(true);", card)
    driver.execute_script("window.scrollBy(0, -100);")
    time.sleep(1)
    driver.execute_script("arguments[0].click();", card)
    time.sleep(2)

    try:
        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
        todos_links = driver.find_elements(By.TAG_NAME, 'a')

        botoes_participar = [
            link for link in todos_links
            if link.text.strip() in ["Participar", "Visualizar"]
        ]

        print(f"Encontrado {len(botoes_participar)} botões em {titulo_secao}")

        # Definindo os índices desejados: 0 para a primeira aba, 6 para a sétima aba
        indices_desejados = [0, 6]

        for j in indices_desejados:

            link = botoes_participar[j].get_attribute("href")
            print(f"Acessando: {link}")
            driver.execute_script("window.open(arguments[0]);", link)
            driver.switch_to.window(driver.window_handles[1])
            time.sleep(3)

            try:
                wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
                links_pag = driver.find_elements(By.TAG_NAME, 'a')

                soup = BeautifulSoup(driver.page_source, "html.parser")
                try:
                    titulo_plano = soup.find("h1", class_="hero-title-br").get_text(strip=True)
                except:
                        titulo_plano = 'Não tem o titulo na página'
                try:
                    descricao_plano = soup.find("p", class_="hero-text-br").get_text(strip=True)
                except:
                    descricao_plano = "Sem descrição"
                print(titulo_plano)
                print(descricao_plano)

                imagem_do_plano = soup.find("meta", property="og:image")

                # pega a imagem do plano
                if imagem_do_plano and imagem_do_plano.get("content"):
                    img_url = imagem_do_plano["content"]
                    print("LINK DA IMAGEM:", img_url)
                else:
                    print("tag <meta property='og:image'> não encontrada.")

                sobre_links = [l for l in links_pag if "sobre" in l.text.lower()]

                
                if sobre_links:
                    sobre_url = sobre_links[0].get_attribute("href").rstrip("/")

                    if sobre_url not in propostas_acessadas:
                        print(f"acessando aba Sobre: {sobre_url}")
                        propostas_acessadas.add(sobre_url)

                        # abre a aba "Sobre" como uma nova aba
                        driver.execute_script("window.open(arguments[0]);", sobre_url)
                        driver.switch_to.window(driver.window_handles[2])
                        time.sleep(5)

                        try:
                                wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'p')))
                                soup_sobre = BeautifulSoup(driver.page_source, "html.parser")

                                paragrafos = soup_sobre.find_all(["p", "h2", "ol"])

                                blacklist_textos = [
                                    "você precisa habilitar todos os cookies para poder ver este conteúdo.",
                                    "site desenvolvido com software livre e mantido por lappis",
                                    "por favor, inicie a sessão",
                                    "inscrever-se",
                                    "esqueceu a sua senha?",
                                    "estes cookies permitem",
                                    "esses cookies são usados",
                                    "estes cookies coletam informações",
                                    "estes cookies são usados para medir",
                                    "figura"
                                ]

                                def normalizar(texto):
                                    return texto.lower().replace(" ", "")

                                conteudos_limpos = []
                                for elem in paragrafos:
                                    texto = elem.get_text(strip=True)
                                    texto_normalizado = normalizar(texto)
                                    if texto and all(normalizar(black) not in texto_normalizado for black in blacklist_textos):
                                        conteudos_limpos.append(texto)

                                # verificação pra ver se a descrição da conferência já está no conteúdo, se tiver nao tem a aba sobre
                                if any(normalizar(descricao_plano) in normalizar(texto) for texto in conteudos_limpos):
                                    print("Não existe a aba sobre")
                                else:
                                    # print("Conteúdo da aba Sobre:\n")
                                    for bloco in conteudos_limpos:
                                        # esse bloco sao os paragrados da pagina sobre
                                        print(bloco)
                                        print(" ")

                                # with open("planos_dados.csv", mode="a", newline="", encoding="utf-8") as f:
                                #             writer = csv.DictWriter(f, fieldnames= [
                                #                     "Plano", 
                                #                     "Descrição Plano", 
                                #                     "Imagem Plano",
                                #                     "Sobre Plano", 
                                #                 ])
                                #             writer.writerow({
                                #                     "Plano": titulo_plano,
                                #                     "Descrição Plano": descricao_plano,
                                #                     "Imagem Plano":img_url, 
                                #                     "Sobre Plano":conteudos_limpos,
                                #                 }) 



                        except Exception as e:
                            print(f"Erro ao extrair conteúdo da aba 'Sobre': {e}")

                        driver.close()
                        driver.switch_to.window(driver.window_handles[1])

                else:
                    print("Aba 'Sobre' não encontrada.")


                proposta_links = [
                    l for l in links_pag if "proposta" in l.text.lower()
                ]

                for proposta in proposta_links:
                    proposta_url = proposta.get_attribute("href").rstrip("/")

                    if "/posts/" in proposta_url or "docs.google.com" in proposta_url:
                        # print(f"ignorando URL de notícia ou docs")
                        continue

                    if proposta_url not in propostas_acessadas:
                        print(f"Acessando proposta NOVA: {proposta_url}")
                        propostas_acessadas.add(proposta_url)

                        driver.execute_script("window.open(arguments[0]);", proposta_url)
                        driver.switch_to.window(driver.window_handles[2])
                        time.sleep(5)

                        try:
                                wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'proposal_card__title')))

                                soupi = BeautifulSoup(driver.page_source, "html.parser")
                                qtd_propostas = soupi.find("p", class_='-counter').get_text(strip=True)
                                print(qtd_propostas)

                                for pagina in range(1, 1000): 
                                    try:
                                        if pagina > 1:
                                            # atualiza o conteúdo da página atual
                                            soup_pag = BeautifulSoup(driver.page_source, "html.parser")

                                            # busca o link com title correspondente à próxima página
                                            proximo_link = soup_pag.find("a", title=f"Número da página: {pagina}")
                                            
                                            if not proximo_link:
                                                print(f"Página {pagina} não encontrada. Fim da paginação.")
                                                break

                                            href = proximo_link.get("href")
                                            url_proxima_pagina = "https://brasilparticipativo.presidencia.gov.br" + href

                                            if url_proxima_pagina in paginas_visitadas:
                                                print(f"Página {pagina} já visitada.")
                                                continue

                                            paginas_visitadas.add(url_proxima_pagina)
                                            driver.get(url_proxima_pagina)
                                            time.sleep(3)

                                            print(f"Indo para página {pagina}.")

                                        # espera as propostas carregarem
                                        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'proposal_card__title')))
                                        titulos_propostas = driver.find_elements(By.CLASS_NAME, 'proposal_card__title')

                                        print(f"Encontradas {len(titulos_propostas)} propostas nesta página.")
                                        contador += 1
                                        print(" ")
                                        print(f"página {contador} --------------------")

                                        # aqui entra em cada proposta
                                        for k in range(len(titulos_propostas)):
                                            # reatualiza a lista a cada iteração por segurança (evita stale element)
                                            titulos_propostas = driver.find_elements(By.CLASS_NAME, 'proposal_card__title')
                                            titulo = titulos_propostas[k]
                                            proposta_url = titulo.find_element(By.XPATH, "..").get_attribute("href").rstrip("/")

                                            if proposta_url in propostas_acessadas:
                                                print(f"Proposta já acessada: {proposta_url}")
                                                continue

                                            print(f"Acessando PROPOSTA NOVA: {proposta_url}")

                                            propostas_acessadas.add(proposta_url)

                                            # scroll para o elemento e clique
                                            driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
                                            driver.execute_script("window.scrollBy(0, -100);")
                                            time.sleep(1)
                                            driver.execute_script("arguments[0].click();", titulo)

                                            try:
                                                # pega título e descrição
                                                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "proposal-title")))
                                                titulo_cada_proposta = driver.find_element(By.CLASS_NAME, "proposal-title").text.strip()
                                                descricao = driver.find_element(By.CLASS_NAME, "br-proposal_body").text.strip()
                                                qtd_votos = driver.find_element(By.CLASS_NAME, "progress__bar__title").text.strip()
                                                qtd_votos = qtd_votos.replace("votos", "").strip()
                                                try:
                                                    autor_proposta = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "author__name"
                                                    ).text.strip()
                                                except:
                                                    autor_proposta = "Autor desconhecido"

                                                print(titulo_cada_proposta)
                                                print(" ")
                                                print(descricao)
                                                print(" ")
                                                print(qtd_votos)
                                                print(" ")
                                                print(autor_proposta)
                                                print(" ")

                                                with open("propostas_planos.csv", mode="a", newline="", encoding="utf-8") as f:
                                                    writer = csv.DictWriter(f, fieldnames= [
                                                        "Plano", 
                                                        "Quantidade Propostas",
                                                        "Título Proposta", 
                                                        "Descrição Proposta", 
                                                        "Link", 
                                                        "Votos",
                                                        "Autor",
                                                    ])
                                                    writer.writerow({
                                                        "Plano": titulo_plano,
                                                        "Quantidade Propostas": qtd_propostas,
                                                        "Título Proposta": titulo_cada_proposta,
                                                        "Descrição Proposta": descricao,
                                                        "Link": proposta_url,
                                                        "Votos": qtd_votos,
                                                        "Autor": autor_proposta,
                                                    })


                                            except Exception as e:
                                                print("Erro ao pegar título", e)

                                            time.sleep(4)

                                            # volta para a página anterior
                                            driver.back()
                                            time.sleep(3)

                                    except Exception as e:
                                        print(f"Erro ao processar página {pagina}: {e}")
                                        continue

                        except Exception as e:
                            print(f"Erro ao acessar propostas individuais: {e}")

                            

                        driver.close()
                        driver.switch_to.window(driver.window_handles[1])
                    else:
                        # print(f"Proposta já acessada: {proposta_url}")
                        print("")

            except Exception as e:
                print(f"erro ao buscar proposta: {e}")

            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            time.sleep(1)

    except Exception as e:
        print(f"erro ao buscar botões: {e}")

driver.quit()
print("acabouuu")


