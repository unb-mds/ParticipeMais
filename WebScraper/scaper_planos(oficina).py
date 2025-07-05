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

if not os.path.exists("oficinas.csv"):
    with open("etapas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Planos",
            "Título Oficina", "Descricao Oficina", "Inscritos Oficina", 
            "Regiao Oficina", "Status Oficina", "Data Oficina",
            "Propostas Oficina", "Quantidade Propostas Oficina",
        ])
        writer.writeheader()

descricao_conferenci = None
contador = 0
contador1 = 0
propostas_acessadas = set()
paginas_visitadas = set()

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

            link = botoes_participar[j + 2].get_attribute("href")
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
                try:
                    titulo_conferencia = soup.find("h1", class_="hero-title-br").get_text(strip=True)
                except:
                    titulo_conferencia = soup.find("h1", class_="page-title").get_text(strip=True)
                
                
                etapas_links = [
                    l for l in links_pag if "realizamos 27" in l.text.lower()
                ]
                
                if etapas_links: 
                    for etapa in etapas_links:
                        etapa_url = etapa.get_attribute("href").rstrip("/")
                    

                    if etapa_url not in propostas_acessadas:
                            print(f"Acessando pagina de etapa NOVA: {etapa_url}")
                            propostas_acessadas.add(etapa_url)

                            driver.execute_script("window.open(arguments[0]);", etapa_url)
                            driver.switch_to.window(driver.window_handles[2])
                            time.sleep(5)

                            # aqui ja ta dentro da pagina de propostas, agora entra uma por uma e é so fazer um script pra pegar os dados
                            try:
                                wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'component_card__title')))

                                soupi = BeautifulSoup(driver.page_source, "html.parser")
                                qtd_etapas = soupi.find("p", class_='-counter').get_text(strip=True)
                                print(qtd_etapas)

                                for pagina1 in range(1, 200): 
                                    try:
                                        if pagina1 > 1:
                                            # atualiza o conteúdo da página atual
                                            soup_pag = BeautifulSoup(driver.page_source, "html.parser")

                                            # busca o link com title correspondente à próxima página
                                            proximo_link = soup_pag.find("a", title=f"Número da página: {pagina1}")
                                            
                                            if not proximo_link:
                                                print(f"Página {pagina1} não encontrada. Fim da paginação.")
                                                break

                                            href = proximo_link.get("href")
                                            url_proxima_pagina = "https://brasilparticipativo.presidencia.gov.br" + href

                                            if url_proxima_pagina in paginas_visitadas:
                                                print(f"Página {pagina1} já visitada.")
                                                continue

                                            paginas_visitadas.add(url_proxima_pagina)
                                            driver.get(url_proxima_pagina)
                                            time.sleep(3)

                                            print(f"Indo para página {pagina1}.")

                                        # espera as propostas carregarem
                                        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'component_card__title')))
                                        titulos_etapas = driver.find_elements(By.CLASS_NAME, 'component_card__title')

                                        print(f"Encontradas {len(titulos_etapas)} etapas nesta página.")
                                        contador1 += 1
                                        print(" ")
                                        print(f"página {contador1} --------------------")

                                        # aqui entra em cada etapa
                                        for k in range(len(titulos_etapas)):
                                            # reatualiza a lista a cada iteração por segurança (evita stale element)
                                            titulos_etapas = driver.find_elements(By.CLASS_NAME, 'component_card__title')

                                            titulo = titulos_etapas[k]
                                            etapa_url = titulo.find_element(By.XPATH, "..").get_attribute("href").rstrip("/")

                                            print(f"Acessando ETAPA NOVA: {etapa_url}")

                                            propostas_acessadas.add(etapa_url)

                                            # Scroll e clique
                                            driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
                                            driver.execute_script("window.scrollBy(0, -100);")
                                            time.sleep(1)
                                            driver.execute_script("arguments[0].click();", titulo)

                                            try:
                                                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h2.title")))
                                                time.sleep(1)

                                                # Tenta pegar especificamente o <h2 class="title">
                                                titulo_cada_etapa = driver.find_element(By.CSS_SELECTOR, "h2.title").text.strip()
                                                print(titulo_cada_etapa)
                                                print(" ")

                                                soup = BeautifulSoup(driver.page_source, 'html.parser')
                                                h2_tag = soup.find("h2", class_="title")


                                                if h2_tag is None:
                                                    raise Exception("Elemento <h2 class='title'> não encontrado no BeautifulSoup.")

                                                descricao_partes = []
                                                current = h2_tag.find_next_sibling()
                                                while current and not (current.name == "div" and "meetings-author-info-br" in current.get("class", [])):
                                                    descricao_partes.append(current.get_text(strip=True))
                                                    current = current.find_next_sibling()

                                                descricao_cada_etapa = "\n".join(descricao_partes)
                                                print(descricao_cada_etapa)
                                                print(" ")


                                                try:
                                                    inscritos_etapa = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "subs-count"
                                                    ).text.strip()
                                                except:
                                                    inscritos_etapa = "Não informado"

                                                try:
                                                    endereco_texto = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "map_location_address"
                                                    ).text.strip()
                                                except:
                                                    endereco_texto = "Não informado"

                                                try:
                                                    mes_etapa = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "extra__month"
                                                    ).text.strip()
                                                    horario_etapa = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "extra__time"
                                                    ).text.strip()

                                                    data_texto = mes_etapa + " " + horario_etapa

                                                except:
                                                    data_texto = "Não informado" 

                                                try:
                                                    status_texto = driver.find_element(
                                                        By.CLASS_NAME,
                                                        "gray card__text--status" 
                                                    ).text.strip()
                                                except:
                                                    status_texto = "Não informado"    


                                                print(inscritos_etapa)
                                                print(" ")
                                                print(endereco_texto)
                                                print(" ")
                                                print(data_texto)
                                                print(" ")
                                                print(status_texto)
                                                print(" ")

                                                divs_linked = soup.find_all("div", class_="linked-proposals-info")

                                                # Lista para armazenar os hrefs encontrados
                                                hrefs_encontrados = []
                                                quantidade_de_propostas = 0

                                                for div in divs_linked:
                                                    primeiro_link = div.find("a")
                                                    if primeiro_link and primeiro_link.has_attr("href"):
                                                        href = primeiro_link["href"]
                                                        href_completo = "https://brasilparticipativo.presidencia.gov.br" + href
                                                        hrefs_encontrados.append(href_completo)
                                                        quantidade_de_propostas += 1
                                                    else:
                                                        print("Nenhum <a> com href encontrado nesta div.")


                                                with open("oficinas.csv", mode="a", newline="", encoding="utf-8") as f:
                                                    writer = csv.DictWriter(f, fieldnames= [
                                                        "Plano", 
                                                        "Título Oficina",
                                                        "Descricao Oficina",
                                                        "Inscritos Oficina",
                                                        "Regiao Oficina",
                                                        "Status Oficina",
                                                        "Data Oficina",
                                                        "Propostas Oficina",
                                                        "Quantidade Propostas Oficina",



                                                    ])
                                                    writer.writerow({
                                                        "Plano": titulo_conferencia,
                                                        "Título Oficina": titulo_cada_etapa,
                                                        "Descricao Oficina": descricao_cada_etapa,
                                                        "Inscritos Oficina": inscritos_etapa,
                                                        "Regiao Oficina": endereco_texto,
                                                        "Status Oficina": status_texto,
                                                        "Data Oficina": data_texto,
                                                        "Propostas Oficina": hrefs_encontrados,
                                                        "Quantidade Propostas Oficina": quantidade_de_propostas,

                                                


                                                    })

                                                print("\nTodos os hrefs coletados:")
                                                for link in hrefs_encontrados:
                                                    print(link)
                                                print(" ")
                                                print(quantidade_de_propostas)

                                            except Exception as e:
                                                print("Erro ao pegar título ou descrição:", e)

                                            time.sleep(4)

                                            # volta para a página anterior
                                            driver.back()
                                            time.sleep(3)

                                    except Exception as e:
                                        print(f"Erro ao processar página {pagina}: {e}")
                                        continue

                            except Exception as e:
                                print(f"Erro ao acessar etapas individuais: {e}")

                            driver.close()
                            driver.switch_to.window(driver.window_handles[1])
                    else:
                        print(f"Pagina de etapas já acessada: {etapa_url}")
                else:
                    print("Não tem etapas")

            except Exception as e:
                print(f"erro ao buscar proposta: {e}")

            driver.close() # fecha a aba
            driver.switch_to.window(driver.window_handles[0]) # volta pra aba anterior
            time.sleep(1)

    except Exception as e:
        print(f"erro ao buscar botões: {e}")

driver.quit()
print("acabouuu")

