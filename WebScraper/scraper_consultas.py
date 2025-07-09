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

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 20)
driver.get("https://brasilparticipativo.presidencia.gov.br/")

secoes_desejadas = ["Consultas Públicas"]

blacklist_textos = [
    "site desenvolvido com software livre e mantido por lappis",
    "você precisa habilitar todos os cookies para poder ver este conteúdo.",
    "por favor, inicie a sessão",
    "inscrever-se",
    "esqueceu a sua senha?",
    "estes cookies permitem",
    "esses cookies são usados",
    "estes cookies coletam informações",
    "estes cookies são usados para medir",
    "figura"
]


if not os.path.exists("dados_consultas.csv"):
    with open("dados_consultas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            'Título Consulta',
            'Descrição Consulta',
            'URL da Imagem',
            'Sobre Consulta',
            'Link da Consulta',
            
            ])
        writer.writeheader()
        
        
if not os.path.exists("proposta_consultas.csv"):
    with open("proposta_consultas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            'Título Consulta',
            'Título de Cada Proposta',
            'Descrição da Proposta',
            'Autor da Proposta',
            ])
        writer.writeheader()

if not os.path.exists("sobre_consultas.csv"):
    with open("sobre_consultas.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            'Título Consulta',
            'Sobre Consulta'
                            
        ])
    

def normalizar(texto):
    return texto.lower().replace(" ", "")

def limpar_conteudo(paragrafos, blacklist_textos):
    conteudos_limpos = []
    for elem in paragrafos:
        texto = elem.get_text(strip=True)
        texto_normalizado = normalizar(texto)
        if texto and all(normalizar(black) not in texto_normalizado for black in blacklist_textos):
            conteudos_limpos.append(texto)
    return conteudos_limpos

#pega o titulo e descricao da consulta
def titulo_descricao_img(soup):
    
    texto_elemento = soup.find("h1", class_="page-title")
    if texto_elemento:
        titulo_consulta = texto_elemento.get_text(strip=True)
    else:
        texto_elemento = soup.find("h1", class_="hero-title-br")
        if texto_elemento:
            titulo_consulta = texto_elemento.get_text(strip=True)
        else:
            elementos = soup.find_all("h2", class_="action_title")
            if len(elementos) >= 2:
                titulo_consulta = elementos[1].get_text(strip=True)
            elif len(elementos) == 1:
                titulo_consulta = elementos[0].get_text(strip=True)
            else:
                titulo_consulta = "Título não encontrado"

    descricao_elemento = soup.find("div", class_="rich-text-display")
    
    if descricao_elemento:
        descricao_consulta = descricao_elemento.get_text(strip=True)
    else:
        descricao_elemento = soup.find("p", class_="hero-text-br")
        if descricao_elemento:
            descricao_consulta = descricao_elemento.get_text(strip=True)
        else:
            descricao_elemento = soup.find("p", class_="action_text")
            if descricao_elemento:
                descricao_consulta = descricao_elemento.get_text(strip=True)
            else:
                descricao_consulta = "Descrição não encontrada"
                
                
    imagem_da_conferencia = soup.find("meta", property="og:image")

    # pega a imagem da conferencia
    if imagem_da_conferencia and imagem_da_conferencia.get("content"):
        img_url = imagem_da_conferencia["content"]

    
    return titulo_consulta, descricao_consulta, img_url




#pega os comentarios
def extrair_comentarios(soup):
    comentarios = []
    for div in soup.find_all("div", class_="comment-thread"):
        for p in div.find_all("p"):
            texto_comentario = p.get_text(strip=True)
            comentarios.append(texto_comentario)
    return comentarios

#acessa pag que contem os comentarios
def acessar_comentarios(pagina_url):
    
    driver.execute_script("window.open(arguments[0]);", pagina_url)
    driver.switch_to.window(driver.window_handles[2])
    time.sleep(5)

                    
    # aqui ja ta dentro da pagina de propostas, agora entra uma por uma e é so fazer um script pra pegar os dados
    try:
        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'participatory-text-item')))

        soup = BeautifulSoup(driver.page_source, "html.parser")
                        
        comentarios = extrair_comentarios(soup)
        
        driver.close()
        driver.switch_to.window(driver.window_handles[1]) 
        
        return comentarios
                        
    except Exception as e:
        print(f"Erro ao acessar propostas individuais: {e}")
        driver.close()
        driver.switch_to.window(driver.window_handles[1]) 
        return []

                    


contador = 0
propostas_acessadas = set()
paginas_visitadas = set()
Inicio = 0
final = 1


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
            print(" ")            
            print(f"Acessando: {link}")
            driver.execute_script("window.open(arguments[0]);", link)
            driver.switch_to.window(driver.window_handles[1])
            time.sleep(3)
            
            # aqui ja ta dentro do processo, filtrei todos os links que tem proposta no nome, se nao \
            # tiver é um processo sem proposta, se tiver clica e entra na pagina de propostas
            try:
                wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
                menu = driver.find_element(By.CLASS_NAME, "space-menu")
                links_pag = menu.find_elements(By.TAG_NAME, 'a')

                soup = BeautifulSoup(driver.page_source, "html.parser")
                
                titulo_consulta, descricao_consulta, img_url = titulo_descricao_img(soup)
                
                print(titulo_consulta)
                print(descricao_consulta)
                print("LINK DA IMAGEM:", img_url)
                
                with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=[
                        'Título Consulta',
                        'Descrição Consulta',
                        'URL da Imagem',
                        'Sobre Consulta',
                        'Link da Consulta',
                    ])
                    writer.writerow({
                        "Título Consulta": titulo_consulta,
                        "Descrição Consulta": descricao_consulta,
                        "URL da Imagem": img_url,
                        "Link da Consulta": link
                    })

                
                containers = soup.find_all("div", class_="step_info-container")
                
                    
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

                            conteudos_limpos = limpar_conteudo(paragrafos, blacklist_textos)
                            with open("sobre_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                                writer = csv.DictWriter(f, fieldnames=[
                                    'Título Consulta',
                                    'Sobre Consulta'
                        
                                ])
                                writer.writerow({
                                    "Título Consulta": titulo_consulta,
                                    "Sobre Consulta": conteudos_limpos,
        
                                })

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
                                            elemento = driver.find_element(By.CLASS_NAME, 'author__name')
                                            autor = elemento.text.strip()
                                            print(titulo_cada_proposta)
                                            print(" ")
                                            print(descricao)
                                            print(" ")
                                            print("Autor:", autor)
                
                                            
                                            with open("proposta_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                                                writer = csv.DictWriter(f, fieldnames=[
                                                    'Título Consulta',
                                                    'Título de Cada Proposta',
                                                    'Descrição da Proposta',
                                                    'Autor da Proposta'
                                                ])
                                                writer.writerow({
                                                    "Título Consulta": titulo_consulta,
                                                    "Título de Cada Proposta": titulo_cada_proposta,
                                                    "Descrição da Proposta": descricao,
                                                    "Autor da Proposta": autor,
                            
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
                        print(f"Pagina de proposta já acessada: {proposta_url}")
                    """

                paragrafos_links = [
                    l for l in links_pag if "parágrafos participativos" in l.text.lower()
                ]

                for paragrafo in paragrafos_links:
                    paragrafo_url = paragrafo.get_attribute("href").rstrip("/")
                    
                    print(f"Acessando página de paragrafo: {paragrafo_url}")
                    
                    comentarios_paragrafos = acessar_comentarios(paragrafo_url)
                    for comentario in comentarios_paragrafos:
                        print("Texto do comentário:", comentario)
                        print(" ")
                        '''with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                            writer = csv.DictWriter(f, fieldnames=[
                                'Título Consulta',
                                'Descrição Consulta',
                                'URL da Imagem',
                                'Enquetes',
                                'Sobre Consulta',
                                'Título de Cada Proposta',
                                'Descrição da Proposta',
                                'Autor da Proposta',
                                'Comentários (Parágrafos)',
                                'Comentários da Consulta (Decreto)',
                                'Comentários da Consulta (Portaria)',
                                'Comentários do Decreto',
                                'Título de Cada Recomendação',
                                'Comentários das Recomendações'
                            ])
                            writer.writerow({
                                "Título Consulta": titulo_consulta,
                                "Descrição Consulta": descricao_consulta,
                                'Comentários (Parágrafos)': comentario
                            })
                                            
                """        
                    
                    
                consulta_decreto_links = [
                    l for l in links_pag if "consulta pública decreto" in l.text.lower()
                ]

                for consulta_decreto in consulta_decreto_links:
                    consulta_decreto_url = consulta_decreto.get_attribute("href").rstrip("/")
                    
                    print(f"Acessando página de consulta decreto: {consulta_decreto_url}")
                    
                    
                    comentarios_consulta_decreto = acessar_comentarios(consulta_decreto_url)
                    for comentario in comentarios_consulta_decreto:
                        print("Texto do comentário:", comentario)
                        print(" ")
                        with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                            writer = csv.DictWriter(f, fieldnames=[
                                'Título Consulta',
                                'Descrição Consulta',
                                'URL da Imagem',
                                'Enquetes',
                                'Sobre Consulta',
                                'Título de Cada Proposta',
                                'Descrição da Proposta',
                                'Autor da Proposta',
                                'Comentários (Parágrafos)',
                                'Comentários da Consulta (Decreto)',
                                'Comentários da Consulta (Portaria)',
                                'Comentários do Decreto',
                                'Título de Cada Recomendação',
                                'Comentários das Recomendações'
                            ])
                            writer.writerow({
                                "Título Consulta": titulo_consulta,
                                "Descrição Consulta": descricao_consulta,
                                'Comentários da Consulta (Decreto)': comentario
                            })
                        
                            
                                    
                consulta_portaria_links = [
                    l for l in links_pag if "consulta pública portaria" in l.text.lower()
                ]

                for consulta_portaria in consulta_portaria_links:
                    consulta_portaria_url = consulta_portaria.get_attribute("href").rstrip("/")
                    
                    print(f"Acessando página de consulta portaria: {consulta_portaria_url}")
                    
                    
                    comentarios_consulta_portaria = acessar_comentarios(consulta_portaria_url)
                    for comentario in comentarios_consulta_portaria:
                        print("Texto do comentário:", comentario)
                        print(" ")
                        '''with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                            writer = csv.DictWriter(f, fieldnames=[
                                'Título Consulta',
                                'Descrição Consulta',
                                'URL da Imagem',
                                'Enquetes',
                                'Sobre Consulta',
                                'Título de Cada Proposta',
                                'Descrição da Proposta',
                                'Autor da Proposta',
                                'Comentários (Parágrafos)',
                                'Comentários da Consulta (Decreto)',
                                'Comentários da Consulta (Portaria)',
                                'Comentários do Decreto',
                                'Título de Cada Recomendação',
                                'Comentários das Recomendações'
                            ])
                            writer.writerow({
                                "Título Consulta": titulo_consulta,
                                "Descrição Consulta": descricao_consulta,
                                'Comentários da Consulta (Portaria)': comentario
                            })'''
                        
                            
                            
                decreto_links = [
                    l for l in links_pag if "decreto" in l.text.lower()
                ]

                for decreto in decreto_links:
                    decreto_url = decreto.get_attribute("href").rstrip("/")
                    
                    print(f"Acessando página de decreto: {decreto_url}")
                    
                    
                    comentarios_decreto = acessar_comentarios(decreto_url)
                    for comentario in comentarios_decreto:
                        print("Texto do comentário:", comentario)
                        print(" ")
                        '''with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                            writer = csv.DictWriter(f, fieldnames=[
                                'Título Consulta',
                                'Descrição Consulta',
                                'URL da Imagem',
                                'Enquetes',
                                'Sobre Consulta',
                                'Título de Cada Proposta',
                                'Descrição da Proposta',
                                'Autor da Proposta',
                                'Comentários (Parágrafos)',
                                'Comentários da Consulta (Decreto)',
                                'Comentários da Consulta (Portaria)',
                                'Comentários do Decreto',
                                'Título de Cada Recomendação',
                                'Comentários das Recomendações'
                            ])
                            writer.writerow({
                                "Título Consulta": titulo_consulta,
                                "Descrição Consulta": descricao_consulta,
                                'Comentários do Decreto': comentario
                            })
                            '''
                    
                recomendacoes_links = [
                    l for l in links_pag if "recomendações" in l.text.lower()
                ]

                for recomendacoes in recomendacoes_links:
                    recomendacoes_url = recomendacoes.get_attribute("href").rstrip("/")
                    
                    print(f"Acessando página de recomendações: {recomendacoes_url}")
                        
                    driver.execute_script("window.open(arguments[0]);", recomendacoes_url)
                    driver.switch_to.window(driver.window_handles[2])
                    time.sleep(5)

                        # aqui ja ta dentro da pagina de propostas, agora entra uma por uma e é so fazer um script pra pegar os dados
                    try:
                        wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'proposal_card__title')))

                        soup = BeautifulSoup(driver.page_source, "html.parser")
                        qtd_propostas = soup.find("p", class_='-counter').get_text(strip=True)
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
                                            
                                    propostas_acessadas.add(proposta_url)

                                    # scroll para o elemento e clique
                                    driver.execute_script("arguments[0].scrollIntoView(true);", titulo)
                                    driver.execute_script("window.scrollBy(0, -100);")
                                    time.sleep(1)
                                    driver.execute_script("arguments[0].click();", titulo)

                                    try:
                                        # pega título e comentários
                                        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "proposal-title")))
                                        
                                        titulo_cada_recomendacao = driver.find_element(By.CLASS_NAME, "proposal-title").text.strip()
                                    
                                        # Pega todas as divs de comentário
                                        comentarios_recomendacoes = driver.find_elements(By.CLASS_NAME, "comment-thread")

                                        print(titulo_cada_recomendacao)
                                        print(" ")

                                        if comentarios_recomendacoes:
                                            # Se encontrou alguma div de comentário
                                            for div_comentario in comentarios_recomendacoes:
                                                paragrafos = div_comentario.find_elements(By.TAG_NAME, "p")
                                                for p in paragrafos:
                                                    texto_comentario = p.text.strip()
                                                    if texto_comentario:  
                                                        print("Texto do comentário:", texto_comentario)
                                                        print(" ")
                                                        '''         with open("dados_consultas.csv", mode="a", newline="", encoding="utf-8") as f:
                                                            writer = csv.DictWriter(f, fieldnames=[
                                                                'Título Consulta',
                                                                'Descrição Consulta',
                                                                'URL da Imagem',
                                                                'Enquetes',
                                                                'Sobre Consulta',
                                                                'Título de Cada Proposta',
                                                                'Descrição da Proposta',
                                                                'Autor da Proposta',
                                                                'Comentários (Parágrafos)',
                                                                'Comentários da Consulta (Decreto)',
                                                                'Comentários da Consulta (Portaria)',
                                                                'Comentários do Decreto',
                                                                'Título de Cada Recomendação',
                                                                'Comentários das Recomendações'
                                                            ])
                                                            writer.writerow({
                                                                "Título de Cada Proposta": titulo_cada_proposta,
                                                                "Descrição da Proposta": descricao,
                                                                'Título de Cada Recomendação': titulo_cada_recomendacao,
                                                                'Comentários das Recomendações': texto_comentario
                                                            })
                                                        '''
                                        else:
                                            print("Nenhum comentário encontrado.")
                                            print(" ")
                                            ''    
                                    except Exception as e:
                                        print("Erro ao pegar título", e)

                                    time.sleep(4)

                                    # volta para a página anterior
                                    driver.back()
                                    time.sleep(3)
                                    
                                    wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'proposal_card__title')))

                            except Exception as e:
                                print(f"Erro ao processar página {pagina}: {e}")
                                continue

                    except Exception as e:
                        print(f"Erro ao acessar propostas individuais: {e}")

                        driver.close()
                        driver.switch_to.window(driver.window_handles[1])
                    else:
                        print(f"Pagina de proposta já acessada: {recomendacoes_url}")
                    
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

