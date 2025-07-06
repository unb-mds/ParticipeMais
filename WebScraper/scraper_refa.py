# Refatorado com funções organizadas e reaproveitamento de código
import os
import csv
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

# ========== CONFIGURAÇÕES ==========
BLACKLIST = [
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

SECOES_DESEJADAS = ["Consultas Públicas"]

# ========== SETUP SELENIUM ==========
options = Options()
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 20)

# ========== HELPERS ==========
def setup_csv(path, fieldnames):
    if not os.path.exists(path):
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

def salvar_csv(path, fieldnames, row):
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow(row)

def normalizar(texto):
    return texto.lower().replace(" ", "")

def limpar_conteudo(paragrafos):
    conteudos = []
    for elem in paragrafos:
        texto = elem.get_text(strip=True)
        texto_normalizado = normalizar(texto)
        if texto and all(normalizar(b) not in texto_normalizado for b in BLACKLIST):
            conteudos.append(texto)
    return conteudos

# ========== EXTRAÇÃO ==========
def extrair_titulo_descricao(soup):
    titulo = soup.find("h1", class_="page-title") or soup.find("h1", class_="hero-title-br")
    if titulo:
        titulo_texto = titulo.get_text(strip=True)
    else:
        h2s = soup.find_all("h2", class_="action_title")
        titulo_texto = h2s[1].get_text(strip=True) if len(h2s) >= 2 else h2s[0].get_text(strip=True) if h2s else "N/A"

    descricao = soup.find("div", class_="rich-text-display") or soup.find("p", class_="hero-text-br") or soup.find("p", class_="action_text")
    descricao_texto = descricao.get_text(strip=True) if descricao else "N/A"

    img_tag = soup.find("meta", property="og:image")
    img_url = img_tag["content"] if img_tag and img_tag.get("content") else ""

    return titulo_texto, descricao_texto, img_url

def extrair_comentarios(soup):
    comentarios = []
    for div in soup.find_all("div", class_="comment-thread"):
        for p in div.find_all("p"):
            texto = p.get_text(strip=True)
            if texto:
                comentarios.append(texto)
    return comentarios

# ========== NAVEGAÇÃO ==========
def abrir_em_nova_aba(driver, url):
    driver.execute_script("window.open(arguments[0]);", url)
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(5)

def fechar_aba_atual(driver):
    driver.close()
    driver.switch_to.window(driver.window_handles[-1])

# ========== PROCESSADORES ==========
def processar_sobre(driver, links_pag, titulo_consulta):
    link = next((l for l in links_pag if "sobre" in l.text.lower()), None)
    if not link:
        print("Aba 'Sobre' não encontrada.")
        return

    url = link.get_attribute("href")
    abrir_em_nova_aba(driver, url)
    try:
        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'p')))
        soup = BeautifulSoup(driver.page_source, "html.parser")
        paragrafos = soup.find_all(["p", "h2", "ol"])
        conteudos = limpar_conteudo(paragrafos)
        salvar_csv("sobre_consultas.csv", ["Título Consulta", "Sobre Consulta"], {
            "Título Consulta": titulo_consulta,
            "Sobre Consulta": "\n".join(conteudos)
        })
        print("Sobre extraído:", conteudos)
    except Exception as e:
        print("Erro no sobre:", e)
    fechar_aba_atual(driver)

def processar_comentarios_em_links(driver, links, titulo_consulta, campo_destino):
    for l in links:
        url = l.get_attribute("href")
        abrir_em_nova_aba(driver, url)
        try:
            wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'comment-thread')))
            soup = BeautifulSoup(driver.page_source, "html.parser")
            comentarios = extrair_comentarios(soup)
            for comentario in comentarios:
                salvar_csv("dados_consultas.csv", [
                    "Título Consulta", campo_destino
                ], {
                    "Título Consulta": titulo_consulta,
                    campo_destino: comentario
                })
                print(f"Comentário salvo: {comentario}")
        except Exception as e:
            print(f"Erro ao extrair comentários em {url}: {e}")
        fechar_aba_atual(driver)

# ========== EXECUÇÃO PRINCIPAL ==========
def main():
    # Criar arquivos CSV
    setup_csv("dados_consultas.csv", ["Título Consulta", "Descrição Consulta", "URL da Imagem", "Sobre Consulta", "Link da Consulta", "Comentários da Consulta (Decreto)", "Comentários da Consulta (Portaria)", "Comentários do Decreto", "Comentários das Recomendações"])
    setup_csv("proposta_consultas.csv", ["Título Consulta", "Título de Cada Proposta", "Descrição da Proposta", "Autor da Proposta"])
    setup_csv("sobre_consultas.csv", ["Título Consulta", "Sobre Consulta"])

    driver.get("https://brasilparticipativo.presidencia.gov.br/")
    wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "section-card")))
    cards = driver.find_elements(By.CLASS_NAME, "section-card")
    cards_filtrados = [c for c in cards if c.find_element(By.CLASS_NAME, "section-card-title").text.strip() in SECOES_DESEJADAS]

    for card in cards_filtrados:
        titulo = card.find_element(By.CLASS_NAME, "section-card-title").text.strip()
        print(f"Entrando em {titulo}")
        driver.execute_script("arguments[0].scrollIntoView(true);", card)
        driver.execute_script("window.scrollBy(0, -100);")
        time.sleep(1)
        card.click()
        time.sleep(2)

        wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'a')))
        botoes = [l for l in driver.find_elements(By.TAG_NAME, 'a') if l.text.strip() in ["Participar", "Visualizar"]]

        for botao in botoes:
            url = botao.get_attribute("href")
            abrir_em_nova_aba(driver, url)
            try:
                wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "space-menu")))
                soup = BeautifulSoup(driver.page_source, "html.parser")
                titulo_consulta, descricao_consulta, img_url = extrair_titulo_descricao(soup)
                menu = driver.find_element(By.CLASS_NAME, "space-menu")
                links_pag = menu.find_elements(By.TAG_NAME, "a")

                salvar_csv("dados_consultas.csv", ["Título Consulta", "Descrição Consulta", "URL da Imagem", "Link da Consulta"], {
                    "Título Consulta": titulo_consulta,
                    "Descrição Consulta": descricao_consulta,
                    "URL da Imagem": img_url,
                    "Link da Consulta": url
                })

                # Extração da aba "Sobre"
                processar_sobre(driver, links_pag, titulo_consulta)

                # Comentários de decretos, portarias e recomendações
                processar_comentarios_em_links(driver, [l for l in links_pag if "consulta pública decreto" in l.text.lower()], titulo_consulta, "Comentários da Consulta (Decreto)")
                processar_comentarios_em_links(driver, [l for l in links_pag if "consulta pública portaria" in l.text.lower()], titulo_consulta, "Comentários da Consulta (Portaria)")
                processar_comentarios_em_links(driver, [l for l in links_pag if "decreto" in l.text.lower()], titulo_consulta, "Comentários do Decreto")
                processar_comentarios_em_links(driver, [l for l in links_pag if "recomendações" in l.text.lower()], titulo_consulta, "Comentários das Recomendações")

            except Exception as e:
                print("Erro ao processar consulta:", e)
            fechar_aba_atual(driver)

    driver.quit()
    print("Fim da execução")

if __name__ == "__main__":
    main()
