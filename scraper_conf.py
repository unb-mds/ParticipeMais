from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
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
        writer = csv.DictWriter(f, fieldnames=["Conferência", "Descrição Conferência", "Etapas", "Título Proposta", "Descrição Proposta", "Link"])
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

                containers = soup.find_all("div", class_="step_info-container")

                etapas = []
                for i, container in enumerate(containers, 1):
                    texto_div = container.find("div", class_="step_info-text gray-step")
                    if texto_div:
                        titulo = texto_div.find("h2")
                        descricao = texto_div.find("p")

                        titulo_texto = titulo.get_text(strip=True) if titulo else ""
                        descricao_texto = descricao.get_text(strip=True) if descricao else ""

                        texto_final = f"{titulo_texto} - {descricao_texto}"
                        # print(f"Texto da etapa {i}: {texto_final}")
                        etapas.append(texto_final)
                    else:
                        print(f"Texto da etapa {i} não encontrado.")

                print(etapas)

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
                            

                            while True:
                                time.sleep(2)
                                wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'proposal_card__title')))
                                titulos_propostas = driver.find_elements(By.CLASS_NAME, 'proposal_card__title')

                                print(f"Encontradas {len(titulos_propostas)} propostas nesta página.")
                                contador += 1
                                print(" ")
                                print(f"página {contador} --------------------")

                                # aqui entra em cada proposta
                                for k in range(len(titulos_propostas)):
                                    titulos_propostas = driver.find_elements(By.CLASS_NAME, 'proposal_card__title')
                                    titulo = titulos_propostas[k]
                                    proposta_url = titulo.find_element(By.XPATH, "..").get_attribute("href").rstrip("/")

                                    if proposta_url in propostas_acessadas:
                                        print(f"Proposta já acessada: {proposta_url}")
                                        continue
                                    
                                    if proposta_url in propostas_salvadas:
                                        print(f"Proposta já foi salva: {proposta_url}")
                                        continue 
                                    
                                    propostas_salvadas.add(proposta_url)
                                    
                                    with open("propostas_visitadas.txt", "a", encoding="utf-8") as f:
                                        f.write(proposta_url + "\n")

                                    print(f"Acessando PROPOSTA NOVA: {proposta_url}")

                                    driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
                                    driver.execute_script("window.scrollBy(0, -100);")
                                    time.sleep(1)
                                    driver.execute_script("arguments[0].click();", titulo)

                                    try:
                                        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "proposal-title")))
                                        titulo_cada_proposta = driver.find_element(By.CLASS_NAME, "proposal-title").text.strip()
                                        descricao = driver.find_element(By.CLASS_NAME, "br-proposal_body").text.strip()

                                        print(titulo_cada_proposta)
                                        print(" ")
                                        print(descricao)
                                        print(" ")
                                        
                                        with open("propostas.csv", mode="a", newline="", encoding="utf-8") as f:
                                            writer = csv.DictWriter(f, fieldnames=[
                                                "Conferência", "Descrição Conferência", "Etapas", 
                                                "Título Proposta", "Descrição Proposta", "Link"
                                            ])
                                            writer.writerow({
                                                "Conferência": titulo_conferencia,
                                                "Descrição Conferência": descricao_conferencia,
                                                "Etapas": texto_final, 
                                                "Título Proposta": titulo_cada_proposta,
                                                "Descrição Proposta": descricao,
                                                "Link": proposta_url
                                            })
                                            
                                            print("Dados salvos com sucesso!")
                                    except Exception as e:
                                        print("Erro ao pegar título", e)
                                    
                                    
                                    time.sleep(4)

                                    driver.back()
                                    time.sleep(3)

                                # aqui é o rolador de página pra pegar nao so as propostas da pagina 1
                                try:
                                    for x in range(2, 30):  
                                        try:
                                            xpath_pagina = f"/html/body/div[7]/div/div[5]/div/div[3]/nav/ul/li[{x}]/a"
                                            botao_pagina = driver.find_element(By.XPATH, xpath_pagina)

                                            href = botao_pagina.get_attribute("href")
                                            if href in paginas_visitadas:
                                                # print(f"Página {x} já visitada.")
                                                continue

                                            # print(f"Indo para página {x} de propostas.")
                                            paginas_visitadas.add(href)
                                            driver.get(href)
                                            time.sleep(3)

                                            break  # sai do for assim que encontrar e entrar na próxima página

                                        except Exception as e:
                                            # print(f"li[{x}] não encontrado, tentando próximo...")
                                            continue
                                    else:
                                        print("Não há mais páginas numeradas neste processo.")
                                        break

                                except Exception as e:
                                    print(f"Erro ao tentar navegar entre páginas numeradas: {e}")
                                    break

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