import pandas
df = pandas.read_csv("resultados/conferencias/propostas.csv")
# print(df.iloc[10770:])

print(df[df["Autor"] == "RAQUEL"])
