# MostraTec CSAT

Este projeto é uma aplicação *lean* de CSAT (Customer Satisfaction) para a MostraTec, composta por três páginas HTML/JS/CSS e um back-end em Node.js/Express com SQLite:

1. **Home** (`index.html`) — título, QR Code e botão “Avaliar”
2. **Cadastro** (`cadastro.html`) — captura nome, papel (aluno/professor/visitante), consentimento LGPD e telefone (com máscara). Inclui botão **Voltar** para a Home.
3. **Survey** (`survey.html`) — coleta nota (1–5 via emojis) e, se nota ≤ 2, comentário. Após envio, exibe “Obrigado” e, em 5 segundos, retorna automaticamente à Home.

> **Regras de negócio**
>
> * Consentimento LGPD obrigatório para sorteio; primeiro clique sem consentimento exibe alerta e permanece na página.
> * Telefone inválido (menos de 14 caracteres) exibe alerta, mas prossegue sem sorteio.
> * Telefone duplicado (via API `/api/check-phone`) alerta “já participa do sorteio” e prossegue.
> * Não há operações de *update* ou *delete*, apenas *insert* e validações.

## 🚀 Tecnologias

* **Node.js** + **Express**: servidor web e API REST
* **SQLite**: armazenamento em `data.db`
* **JavaScript**, **HTML**, **CSS**: front-end estático em `public/`

## 📂 Estrutura de Pastas

```
mostratec-csat/
│
├─ package.json            # dependências e scripts (start)
├─ app.js                  # servidor Express (porta via env PORT)
├─ db.js                   # inicialização do SQLite (tabela evaluations)
├─ data.db                 # banco de dados (persistido entre reinícios)
├─ submissions.json        # (opcional) log JSON de todas as submissões
├─ public/
│  ├─ assets/
│  │  ├─ qrcode.png        # QR Code grande para página Home
│  │  └─ emojis/           # emojis do CSAT (PNG)
│  ├─ index.html           # página Home com QR Code
│  ├─ cadastro.html        # página de cadastro do usuário
│  ├─ survey.html          # página de avaliação (CSAT)
│  ├─ style.css            # estilos gerais e componentes
│  └─ script.js            # lógica de navegação, validações e fetch
```

## ⚙️ Instalação

1. Clone ou copie este projeto.
2. Na raiz, instale dependências:

   ```bash
   npm install
   ```
3. Defina a porta (opcional; padrão 3000) e inicie:

   ```bash
   # PowerShell
   $env:PORT = 3000
   npm start
   ```
4. Abra o navegador em `http://localhost:3000` para acessar a **Home**.

## 🖥️ Modo de Uso

1. **Home** (`/index.html`)

   * Exibe “Avalie nosso trabalho”, QR Code grande e botão **Avaliar**.
   * Ao clicar, vai para **Cadastro**.
2. **Cadastro** (`/cadastro.html`)

   * Informe **nome**, escolha **papel** (Aluno/Professor/Visitante).
   * Marque o consentimento (LGPD) para habilitar o campo **Celular**.
   * **Voltar** retorna à Home; **Iniciar Avaliação** segue para Survey.
   * Regras de alerta e validação conforme o enunciado.
3. **Survey** (`/survey.html`)

   * Selecione nota de 1 a 5 (via emojis).
   * Se 1–2, exibe campo de comentário.
   * Ao enviar, armazena no banco e mostra “👏 Obrigado pela avaliação!”.
   * Após 5 segundos, redireciona automaticamente à Home.

## 🔗 Endpoints da API

* **GET** `/api/check-phone?phone=...` — retorna `{ exists: true|false }` para validação de duplicidade
* **POST** `/api/submit` — payload JSON `{ name, role, consent, phone, rating, comment }`, retorna `{ success: true }`
* **GET** `/api/evaluations` — retorna JSON de todas as submissões com todos os campos

## 📊 Acesso aos Dados

### 1. Via API REST

acesse `http://localhost:3000/api/evaluations` para obter todos os registros em JSON.

### 2. Via SQLite CLI

```bash
sqlite3 data.db
SELECT * FROM evaluations;
.exit
```

### 3. Backup JSON

o arquivo `submissions.json` contém um array com todos os registros:

```json
[
  {
    "id": 1,
    "timestamp": "2025-06-10T19:45:12.345Z",
    "name": "João Silva",
    "role": "aluno",
    "consent": 1,
    "phone": "(34) 91234-5678",
    "rating": 5,
    "comment": null
  },
  ...
]
```

## 📈 Análise de Dados

Use Python (`requests` + `pandas`) ou diretamente o CLI SQLite. Exemplo em Python:

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect('data.db')
df = pd.read_sql_query('SELECT * FROM evaluations', conn)
print(df['rating'].value_counts())  # distribuição de notas

prom = df[df.rating >= 4].shape[0]
det = df[df.rating <= 2].shape[0]
print('NPS:', (prom/len(df) - det/len(df))*100)
```

## 🤝 Contribuição

Feedback e melhorias são bem-vindos! Faça um fork, ajustes e abra um pull request.

---

Para MostraTec 2025
