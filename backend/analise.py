"""Análise de dados de conferências a partir de arquivo CSV."""

import pandas as pd

# Ajusta opções de exibição para mostrar o conteúdo completo no terminal
pd.set_option('display.max_colwidth', None)  # Mostra todo o conteúdo das células
pd.set_option('display.max_rows', None)      # Mostra todas as linhas, se necessário

# Carrega o CSV
df_conferencias = pd.read_csv('../WebScraper/resultados/consultas/dados_consultas.csv')

# Exibe o nome exato das colunas para verificar grafia
print("Colunas disponíveis:", df_conferencias.columns)

# Substitua pelo nome exato da coluna, ex: "Título Consulta"
titulos_unicos = df_conferencias["Título Consulta"].drop_duplicates()

print("\nTítulos de Consulta sem duplicatas:")
print(titulos_unicos)

# Colunas disponíveis: Index(['Título Consulta', 'Descrição Consulta', 'URL da Imagem',
#        'Sobre Consulta',
#        'Título Consulta','Título de Cada Proposta', 'Descrição da Proposta', 'Autor da Proposta'],
#       dtype='object')

# # Verifica e exibe duplicatas totais
# duplicatas = df_conferencias[df_conferencias.duplicated()]
# print("🔍 Linhas duplicadas:")
# print(duplicatas)

# # Verifica duplicações por título de etapa
# duplicadas_por_titulo = df_conferencias[df_conferencias.duplicated(subset=['Título Etapa'])]
# print("🔁 Etapas com título duplicado:")
# print(duplicadas_por_titulo)

# # Total
# print(f"🔢 Total de linhas duplicadas: {df_conferencias.duplicated().sum()}")
