# 🔒 Guia de Setup — Rastreamento Privado de Leads

> **Leva ~15 minutos para configurar. Faça UMA VEZ e funciona para sempre.**

---

## PARTE 1 — Criar o Bot do Telegram (5 min)

### Passo 1 — Criar o bot
1. Abra o Telegram e pesquise: **@BotFather**
2. Clique em **Start** e envie: `/newbot`
3. Dê um nome para o bot (ex: `Alpha Leads Monitor`)
4. Dê um username terminando em `bot` (ex: `alpha_leads_monitor_bot`)
5. O BotFather vai te enviar um **TOKEN** parecido com:
   ```
   7412345678:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   > ⚠️ Guarde esse token — você vai precisar em breve.

### Passo 2 — Descobrir seu Chat ID
1. Pesquise no Telegram: **@userinfobot**
2. Clique **Start**
3. Ele vai responder com seu **Id** (número). Ex: `123456789`
   > ⚠️ Guarde esse número.

### Passo 3 — Ativar o bot
1. Pesquise o seu bot pelo username que você criou
2. Clique **Start** (obrigatório para receber mensagens)

---

## PARTE 2 — Configurar o Google Apps Script (8 min)

### Passo 1 — Criar a planilha
1. Acesse: **https://sheets.new**
2. Nomeie como: `Alpha Convênios — Leads Privados`
3. Abra o menu: **Extensões → Apps Script**

### Passo 2 — Colar o código
1. Apague o código padrão (`function myFunction() {}`)
2. Abra o arquivo: `apps-script/codigo.gs` (neste projeto)
3. Copie o conteúdo inteiro e cole no editor do Apps Script
4. Salve com `Ctrl+S` e nomeie o projeto (ex: `Alpha Lead Tracker`)

### Passo 3 — Configurar o Token e Chat ID do Telegram
1. No Apps Script, clique no ícone de engrenagem ⚙️ → **Configurações do projeto**
2. Role até **Propriedades do script** → clique em **Adicionar propriedade**
3. Adicione as duas propriedades:

   | Nome da propriedade | Valor |
   |---------------------|-------|
   | `TELEGRAM_TOKEN`    | `7412345678:AAFxxx...` (seu token do BotFather) |
   | `TELEGRAM_CHAT_ID`  | `123456789` (seu chat ID do @userinfobot) |

4. Clique em **Salvar propriedades do script**

### Passo 4 — Implantar como App da Web
1. Clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem ⚙️ ao lado de "Tipo" → **App da Web**
3. Configure:
   - **Executar como:** Eu (sua conta Google)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**
5. Autorize as permissões que o Google pedir
6. Copie a **URL do app da Web** — ela tem o formato:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   > ⚠️ Guarde essa URL — você vai precisar no próximo passo.

---

## PARTE 3 — Conectar ao site (2 min)

### Passo 1 — Criar o arquivo .env
Na pasta raiz do projeto (`c:\DEV\alpha`), crie um arquivo chamado `.env`:
```
VITE_LEAD_WEBHOOK=https://script.google.com/macros/s/SEU_ID_AQUI/exec
```
Substitua pelo URL real que você copiou.

### Passo 2 — Testar localmente
```bash
npm run dev
```
Preencha o formulário e envie. Verifique:
- ✅ Planilha Google recebeu a linha
- ✅ Telegram recebeu a notificação

### Passo 3 — Build e deploy
```bash
npm run build
```
Suba para o servidor normalmente. A URL do webhook fica embutida no bundle minificado.

---

## ✅ Resultado Final

Toda vez que alguém preencher o formulário no site:

**Você recebe no Telegram:**
```
🔔 NOVO LEAD — Alpha Convênios

👤 Nome: João Silva
📱 Telefone: (11) 99999-9999
📧 E-mail: joao@email.com
🏢 Plano: empresarial
🕐 Horário: 28/05/2026 20:15:33
🌐 Site: alphaconvenios.com.br
```

**E na planilha Google você tem:**

| Data/Hora | Nome | Telefone | E-mail | Tipo de Plano | Origem |
|-----------|------|----------|--------|---------------|--------|
| 28/05/2026 20:15 | João Silva | (11) 99999-9999 | joao@email.com | empresarial | alphaconvenios.com.br |

---

## 🔒 Segurança

- O arquivo `.env` **nunca** é commitado no Git (protegido pelo `.gitignore`)
- A URL do webhook fica **minificada/ofuscada** no bundle de produção
- O cliente **não tem acesso** à sua conta Google ou ao bot do Telegram
- O `no-cors` faz o request funcionar sem expor erros no console do navegador
