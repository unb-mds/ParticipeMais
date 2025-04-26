from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup, NavigableString, Tag
import time
import requests
import csv
import os

options = Options()
# options.headless = True  # ativar se quiser rodar em segundo plano

driver = webdriver.Firefox(options=options)
wait = WebDriverWait(driver, 20)
driver.get("https://brasilparticipativo.presidencia.gov.br/")

secoes_desejadas = ["Conferências"]



if not os.path.exists("propostas.csv"):
    with open("propostas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Conferência", 
            "Descrição Conferência", 
            "Sobre Conferência", 
            "Etapas", 
            "Título Proposta", 
            "Descrição Proposta", 
            "Link", 
            "Imagem Conferência"
            ])
        writer.writeheader()
        
    with open("perguntas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
                "Conferência",
                "Perguntas", 
                "Respostas", 
            ])
        writer.writeheader()  


contador = 0
propostas_acessadas = set()
paginas_visitadas = set()

if os.path.exists("propostas_visitadas.txt"):
    with open("propostas_visitadas.txt", "r", encoding="utf-8") as f:
        propostas_salvadas = set(line.strip() for line in f)
else:
    propostas_salvadas = set()

wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "section-card")))
cards = driver.find_elements(By.CLASS_NAME, "section-card")

cards_filtrados = []
titulos_filtrados = []

# aqui pega todas as classes com nome section card... e filtra as secoes colocadas em cima
for card in cards:
    try:
        titulo = card.find_element(By.CLASS_NAME, "section-card-title").text.strip()
        if titulo in secoes_desejadas:
            cards_filtrados.append(card)
            titulos_filtrados.append(titulo)
    except:
        continue


# aqui clica nas secoes filtradas
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

    # aqui entra na seccao e pega todos os processos que tem nessa seccao
    try:
        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
        todos_links = driver.find_elements(By.TAG_NAME, 'a')

        botoes_participar = [
            link for link in todos_links
            if link.text.strip() in ["Participar", "Visualizar"]
        ]

        print(f"Encontrado {len(botoes_participar)} botões em {titulo_secao}")

        # aqui clica no botao do processo, pego todos os links da pagina e seleciono somente os que tem participar/vizualizar e clico
        for j in range(len(botoes_participar)):
            todos_links = driver.find_elements(By.TAG_NAME, 'a')
            botoes_participar = [
                link for link in todos_links
                if link.text.strip() in ["Participar", "Visualizar"]
            ]

            link = botoes_participar[j].get_attribute("href")
            print(f"Acessando: {link}")
            driver.execute_script("window.open(arguments[0]);", link)
            driver.switch_to.window(driver.window_handles[1])
            time.sleep(3)

            # aqui ja ta dentro do processo, filtrei todos os links que tem proposta no nome, se nao \
            # tiver é um processo sem proposta, se tiver clica e entra na pagina de propostas
            try:
                wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
                links_pag = driver.find_elements(By.TAG_NAME, 'a')

                soup = BeautifulSoup(driver.page_source, "html.parser")

                titulo_conferencia = soup.find("h1", class_="hero-title-br").get_text(strip=True)

                descricao_conferencia = soup.find("p", class_="hero-text-br").get_text(strip=True)
                print(titulo_conferencia)
                print(descricao_conferencia)

                imagem_da_conferencia = soup.find("meta", property="og:image")

                # pega a imagem da conferencia
                if imagem_da_conferencia and imagem_da_conferencia.get("content"):
                    img_url = imagem_da_conferencia["content"]
                    print("LINK DA IMAGEM:", img_url)
                else:
                    print("tag <meta property='og:image'> não encontrada.")

                containers = soup.find_all("div", class_="step_info-container")

                # pega a data das etapas, fica dentro desse container (nome da classe) de informacao
                etapas = []
                for i, container in enumerate(containers, 1):
                    texto_div = container.find("div", class_="step_info-text gray-step")
                    texto_div2 = container.find("div", class_="step_info-text blue-step")
                    texto_div3 = container.find("div", class_="step_info-text write-step")
                    if texto_div:
                        titulo = texto_div.find("h2")
                        descricao = texto_div.find("p")

                        titulo_texto = titulo.get_text(strip=True) if titulo else ""
                        descricao_texto = descricao.get_text(strip=True) if descricao else ""

                        texto_final = f"{titulo_texto} - {descricao_texto}"
                        # print(f"Texto da etapa {i}: {texto_final}")
                        etapas.append(texto_final)

                    elif texto_div2:
                        titulo = texto_div2.find("h2")
                        descricao = texto_div2.find("p")

                        titulo_texto = titulo.get_text(strip=True) if titulo else ""
                        descricao_texto = descricao.get_text(strip=True) if descricao else ""

                        texto_final = f"{titulo_texto} - {descricao_texto}"
                            # print(f"Texto da etapa {i}: {texto_final}")
                        etapas.append(texto_final)
                    elif texto_div3:
                        titulo = texto_div3.find("h2")
                        descricao = texto_div3.find("p")

                        titulo_texto = titulo.get_text(strip=True) if titulo else ""
                        descricao_texto = descricao.get_text(strip=True) if descricao else ""

                        texto_final = f"{titulo_texto} - {descricao_texto}"
                            # print(f"Texto da etapa {i}: {texto_final}")
                        etapas.append(texto_final)
                    else:
                        print(f"Texto da etapa {i} não encontrado.")
                        

                print(etapas)

                # buscar links com a palavra 'pergunta' ou 'dúvida' no texto
                perguntas_links = [
                    l for l in links_pag
                    if "pergunta" in l.text.lower() or "dúvidas" in l.text.lower()
                ]

                for pergunta in perguntas_links:
                    pergunta_url = pergunta.get_attribute("href").rstrip("/")

                    if pergunta_url in propostas_acessadas:
                        print(f"Página de pergunta já acessada: {pergunta_url}")
                        continue

                    print(f"Acessando página de pergunta ou dúvida NOVA: {pergunta_url}")
                    propostas_acessadas.add(pergunta_url)

                    driver.execute_script("window.open(arguments[0]);", pergunta_url)
                    driver.switch_to.window(driver.window_handles[2])
                    time.sleep(5)

                    try:
                        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'p')))
                        soup_perguntas = BeautifulSoup(driver.page_source, "html.parser")

                        paragrafos = soup_perguntas.find_all("p")

                        i = 0
                        while i < len(paragrafos):
                            p = paragrafos[i]
                            strong_em_code = p.find("code")
                            pergunta = None

                            # detecta se é o novo padrão: <code><strong>Pergunta</strong></code>, formatacao conferencia 3
                            if strong_em_code:
                                strong_tag = strong_em_code.find("strong")
                                if strong_tag:
                                    pergunta = strong_tag.get_text(strip=True)
                                   
                                    
                                    # resposta deve estar no <p> seguinte
                                    if i + 1 < len(paragrafos):
                                        resposta = paragrafos[i + 1].get_text(strip=True)
                                        
                                        i += 1  # pula o p da resposta
                                    else:
                                        resposta = ""
        

                                    # print(f"[NOVO PADRÃO]")
                                    print(f"PERGUNTA: {pergunta}")
                                    print(f"RESPOSTA: {resposta}")
                                    print("--------")
                                    
                                    with open("perguntas.csv", mode="a", newline="", encoding="utf-8") as f:
                                        writer = csv.DictWriter(f, fieldnames=["Conferência", "Perguntas", "Respostas"])
                                        writer.writerow({
                                            "Conferência": titulo_conferencia,
                                            "Perguntas": pergunta,
                                            "Respostas": resposta
                                        })
                                    
                            # formatacao conferencia 5
                            elif p.find("strong"):
                                strong_tag = p.find("strong")
                                pergunta = strong_tag.get_text(strip=True)

                                resposta_partes = []
                                for elem in strong_tag.next_siblings:
                                    if isinstance(elem, NavigableString):
                                        resposta_partes.append(elem.strip())
                                    elif isinstance(elem, Tag):
                                        resposta_partes.append(elem.get_text(strip=True))

                                resposta = ' '.join(part for part in resposta_partes if part)

                                if resposta.strip().endswith(":"):
                                    prox_irmao_tag = None
                                    for sibling in p.next_siblings:
                                        if isinstance(sibling, Tag):
                                            prox_irmao_tag = sibling
                                            break

                                    if prox_irmao_tag and prox_irmao_tag.name == "ul":
                                        topicos = [li.get_text(strip=True) for li in prox_irmao_tag.find_all("li")]
                                        resposta += " " + " | ".join(topicos)

                                # print(f"[PADRÃO ANTIGO]")
                                print(f"PERGUNTA: {pergunta}")
                                print(f"RESPOSTA: {resposta}")
                                print("--------")
                                
                                with open("perguntas.csv", mode="a", newline="", encoding="utf-8") as f:
                                    writer = csv.DictWriter(f, fieldnames=["Conferência", "Perguntas", "Respostas"])
                                    writer.writerow({
                                        "Conferência": titulo_conferencia,
                                        "Perguntas": pergunta,
                                        "Respostas": resposta
                                    })
                                
                                

                            i += 1

                    except Exception as e:
                        print(f"Erro ao acessar perguntas: {e}")

                    driver.close()
                    driver.switch_to.window(driver.window_handles[1])


                # localiza a aba "Sobre"
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
                            if any(normalizar(descricao_conferencia) in normalizar(texto) for texto in conteudos_limpos):
                                print("Não existe a aba sobre")
                            else:
                                # print("Conteúdo da aba Sobre:\n")
                                for bloco in conteudos_limpos:
                                    # esse bloco sao os paragrados da pagina sobre
                                    print(bloco)
                                    print(" ")

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

                    # algumas "propostas" levava para uma noticia ou abria um docs
                    if "/posts/" in proposta_url or "docs.google.com" in proposta_url:
                        print(f"ignorando URL de notícia ou docs")
                        continue

                    # evita abrir pagina de propostas que ja foram abertas
                    if proposta_url not in propostas_acessadas:
                        print(f"Acessando pagina de proposta NOVA: {proposta_url}")
                        propostas_acessadas.add(proposta_url)

                        driver.execute_script("window.open(arguments[0]);", proposta_url)
                        driver.switch_to.window(driver.window_handles[2])
                        time.sleep(5)

                        # aqui ja ta dentro da pagina de propostas, agora entra uma por uma e é so fazer um script pra pegar os dados
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
                                        
                                        propostas_salvadas.add(proposta_url)
                                    
                                        with open("propostas_visitadas.txt", "a", encoding="utf-8") as f:
                                            f.write(proposta_url + "\n")

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

                                            print(titulo_cada_proposta)
                                            print(" ")
                                            print(descricao)
                                            print(" ")
                                            
                                            with open("propostas.csv", mode="a", newline="", encoding="utf-8") as f:
                                                writer = csv.DictWriter(f, fieldnames= [
                                                    "Conferência", 
                                                    "Descrição Conferência", 
                                                    "Sobre Conferência", 
                                                    "Etapas", 
                                                    "Título Proposta", 
                                                    "Descrição Proposta", 
                                                    "Link", 
                                                    "Imagem Conferência"
                                                ])
                                                writer.writerow({
                                                    "Conferência": titulo_conferencia,
                                                    "Descrição Conferência": descricao_conferencia,
                                                    "Sobre Conferência":conteudos_limpos,
                                                    "Etapas": texto_final,
                                                    "Título Proposta": titulo_cada_proposta,
                                                    "Descrição Proposta": descricao,
                                                    "Link": proposta_url,
                                                    "Imagem Conferência": img_url
                                                })
                                                
                                            
                                            print("Dados salvos com sucesso!")
                                            
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
                        print(f"Pagina de proposta já acessada: {proposta_url}")

            except Exception as e:
                print(f"erro ao buscar proposta: {e}")

            driver.close() # fecha a aba
            driver.switch_to.window(driver.window_handles[0]) # volta pra aba anterior
            time.sleep(1)

    except Exception as e:
        print(f"erro ao buscar botões: {e}")

driver.quit()
print("acabouuu")

# OQUE ESTÁ SENDO COLETADO:

# nome da conferência     - 100
# descrição da conferência    - 102
# imagem da conferência    - 106
# sobre a conferência     - 300
# etapas com datas de inicio e término   - 158
# quantidade de propostas     -  338
# titulo de cada proposta     -  399
# descrição de cada proposta    - 400
# perguntas participativas (perguntas)     - 206 236   (ou é uma ou é outra, as conferencias tem formatacoes diferentes)
# perguntas participativas (respostas)     - 207 237    