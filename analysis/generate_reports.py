import sqlite3, pandas as pd, matplotlib.pyplot as plt, os, json

conn = sqlite3.connect('../backend/data.db')
df_all = pd.read_sql_query('SELECT * FROM evaluations', conn)
original_total = len(df_all)
df = df_all.drop_duplicates(subset='phone', keep='first')
filtered_total = len(df)
duplicados = original_total - filtered_total

outdir = '../backend/public/analysis'
os.makedirs(outdir, exist_ok=True)

total = filtered_total
soma_notas = df['rating'].sum()
prom = df[df.rating >= 4].shape[0]
neutros = df[df.rating == 3].shape[0]
det = df[df.rating <= 2].shape[0]
nps = (prom/total - det/total) * 100

with open(os.path.join(outdir,'metrics.txt'),'w', encoding='utf-8') as f:
    f.write(f'Total de avaliações recebidas: {original_total}\n')
    f.write(f'Avaliações únicas (consideradas): {filtered_total}\n')
    f.write(f'Avaliações duplicadas descartadas: {duplicados}\n\n')
    f.write(f'Soma de notas: {soma_notas}\n')
    f.write(f'Promotores: {prom}\n')
    f.write(f'Neutros: {neutros}\n')
    f.write(f'Detratores: {det}\n')
    f.write(f'NPS estimado: {nps:.1f}%\n')

resumo = (
    df.groupby('role')
      .agg(total_respostas=('rating','count'),
           media_nota=('rating','mean'))
      .reset_index()
)
records = resumo.to_dict(orient='records')
with open(os.path.join(outdir,'role_summary.json'),'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

plt.figure()
plt.hist(df['rating'], bins=5, edgecolor='black')
plt.title('Distribuição de Notas CSAT')
plt.xlabel('Nota'); plt.ylabel('Frequência')
plt.tight_layout()
plt.savefig(os.path.join(outdir,'histogram.png'))
plt.close()

plt.figure()
resumo.set_index('role')['total_respostas'].plot.bar()
plt.title('Respostas por Papel')
plt.xlabel('Papel'); plt.ylabel('Quantidade')
plt.tight_layout()
plt.savefig(os.path.join(outdir,'bar_by_role.png'))
plt.close()
