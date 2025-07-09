import os 

ip_antigo = str(input('Insira o ip antigo (o que está presente no código): '))
ip_novo = str(input('Agora insira o ip novo (o que você deseja trocar): '))

# esteja na pasta /backend para rodar ou mude os diretorios
caminho_diretorio_1 = '../frontEnd/projeto/participe-mais/app'
caminho_diretorio_2 = '../frontEnd/projeto/participe-mais/components'

diretorios = [caminho_diretorio_1, caminho_diretorio_2]

for caminho in diretorios:
    for root, dirs, files in os.walk(caminho):
        for file in files: 
            if file.endswith('.tsx'):
                caminho_arquivo = os.path.join(root, file)
                # print(caminho_arquivo) # ver quais rotas está acessando
                
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                
                if ip_antigo in conteudo:
                    print(f'Ip encontrado em {caminho_arquivo}')
                    novo_conteudo = conteudo.replace(ip_antigo, ip_novo)
                    with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                        f.write(novo_conteudo)
                        print(f'Substituído em: {caminho_arquivo}')
