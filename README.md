# 📊 MostraTec CSAT – Trabalho Final de Ciência de Dados

Este projeto é uma aplicação completa de análise de satisfação de usuários (**CSAT – Customer Satisfaction**) desenvolvida para a MostraTec, utilizando técnicas e ferramentas de Ciência de Dados. A aplicação atende todas as etapas obrigatórias do projeto: coleta de dados, pré-processamento, análise exploratória, modelagem básica e visualização.

---

## 🎯 Objetivo

Desenvolver uma aplicação funcional que utiliza técnicas de Ciência de Dados para coletar, analisar e visualizar métricas de satisfação dos usuários da MostraTec.

---

## 🚀 Funcionalidades Principais

### Front-end Web (HTML/CSS/JS)

- Página **Home** (`index.html`) com QR Code, botão para iniciar avaliação e engrenagem para acesso ao **Painel Administrativo**.
- Página de **Cadastro** (`cadastro.html`) para captura de nome, papel (Aluno/Professor/Visitante), consentimento obrigatório LGPD e telefone com validação.
- Página **Survey** (`survey.html`) para coleta de notas (emojis) e comentários opcionais válidos para qualquer nota.

### Painel Administrativo (Bootstrap)

- Acesso via engrenagem no menu superior da página Home (`index.html`).
- Autenticação segura com credenciais padrão (usuário: `admin`, senha: `admin`).
- Dashboard com **gráficos**, **métricas agrupadas por bloco** e **resumo por papel**.
- Visualização completa das avaliações realizadas.
- Funcionalidade para sorteio randômico de um avaliador válido com telefone.

> 💡 O painel de métricas agora é segmentado em blocos:
>
> - 📊 **Avaliações**: totais, únicas e duplicadas  
> - 🧮 **Indicadores**: soma das notas e NPS estimado  
> - 🎯 **Classificação NPS**: Detratores (🔴), Neutros (🟡), Promotores (🟢)

### Back-end (Node.js/Express)

- Servidor com endpoints seguros para validação e armazenamento dos dados.
- Autenticação com sessões gerenciadas.
- Armazenamento persistente em SQLite (`data.db`).
- Executa automaticamente o script `generate_reports.py` ao acessar o dashboard (`/admin/dashboard`), garantindo gráficos e métricas atualizados.

### Análise de Dados (Python)

- Script `generate_reports.py` responsável pela limpeza, pré-processamento e análises:
  - Remoção automática de duplicidades por telefone.
  - Geração de arquivos gráficos e relatórios (.png, .txt, .json).
  - Cálculo de métricas **incluindo Neutros**, além de Detratores e Promotores.

---

## 📁 Estrutura Atualizada do Projeto

```
MOSTRATEC-CSAT-ANALYTICS/
│
├─ analysis/
│  ├─ csat_analysis.ipynb        # Notebook Python para análises adicionais
│  └─ generate_reports.py        # Script Python para geração de relatórios
│
├─ backend/
│  ├─ app.js                     # Servidor Express
│  ├─ data.db                    # Banco SQLite
│  ├─ db.js                      # Configuração SQLite
│  ├─ package.json               # Dependências Node
│  └─ public/
│     ├─ admin/
│     │  ├─ dashboard.html       # Dashboard Admin (Bootstrap)
│     │  ├─ evaluations.html     # Avaliações Admin (Bootstrap)
│     │  ├─ login.html           # Login Admin (Bootstrap)
│     │  ├─ sorteio.html         # Sorteio Admin (Bootstrap)
│     ├─ analysis/
│     │  ├─ bar_by_role.png      # Gráfico por papel
│     │  ├─ histogram.png        # Histograma de notas
│     │  ├─ metrics.txt          # Métricas gerais
│     │  └─ role_summary.json    # Resumo por papel
│     ├─ assets/
│     │  ├─ emojis/              # Emojis utilizados no survey
│     │  ├─ mostratec-header.png # Cabeçalho MostraTec
│     │  └─ qrcode.png           # QR Code principal
│     ├─ admin.css               # Estilos específicos do Admin
│     ├─ cadastro.html
│     ├─ index.html
│     ├─ script.js
│     ├─ style.css
│     └─ survey.html
│
├─ submissions.json              # Backup JSON
├─ .gitignore
├─ pyvenv.cfg
└─ README.md
```

---

## ⚙️ Instalação e Execução

### Configuração do Ambiente Node.js

```bash
cd backend
npm install
npm start
```

Abra no navegador: `http://localhost:3000`

### Configuração do Ambiente Python

Use um ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate # Linux/Mac
.\venv\Scripts\activate # Windows
pip install pandas numpy matplotlib
```

O script `generate_reports.py` será executado automaticamente ao acessar o dashboard administrativo. Para rodar manualmente:

```bash
python analysis/generate_reports.py
```

---

## 🔍 Regras de Negócio

* Consentimento LGPD obrigatório para participação.
* Validação do telefone para evitar duplicidades.
* Comentários opcionais válidos para qualquer nota.
* Login administrativo via menu da Home com credenciais padrão (`admin`/`admin`).

---

## 📡 Endpoints da API

| Método | Endpoint           | Descrição                         |
| ------ | ------------------ | --------------------------------- |
| GET    | `/api/check-phone` | Verifica duplicidade de telefone  |
| POST   | `/api/submit`      | Envio dos dados da avaliação      |
| GET    | `/api/evaluations` | Recupera todas avaliações em JSON |

Exemplo:

```json
POST /api/submit
{
  "name": "João Silva",
  "role": "aluno",
  "consent": 1,
  "phone": "(34) 91234-5678",
  "rating": 5,
  "comment": null
}
```

---

## 📈 Análise Exploratória e Visualização

O script Python `generate_reports.py` gera automaticamente:

* `histogram.png`: Distribuição das notas.
* `bar_by_role.png`: Avaliações segmentadas por papel.
* `metrics.txt`: Métricas agrupadas por bloco (NPS, soma, duplicadas, etc.)
* `role_summary.json`: Resumo detalhado por tipo de usuário.

---

## 🎥 Apresentação Final

* Demonstre o fluxo completo da aplicação (Home → Cadastro → Survey).
* Demonstre login e funcionalidades do painel administrativo.
* Explique brevemente os insights obtidos pela análise exploratória.

---

> ## 🧑‍🎓 Equipe do Trabalho

| Nome                      | RA      |
| ------------------------- | ------- |
| Andrey Pereira Silva      | 5160888 |
| Bruna Barbosa Carrijo     | 5160711 |
| Lana Urzedo               | 5161886 |
| Matheus Santana Gonçalves | 1157671 |

Desenvolvido para a disciplina de Ciência de Dados – Uniube 2025.