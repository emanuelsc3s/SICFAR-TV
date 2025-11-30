# Guia de Implementação - Feature de Notícias

## Pré-requisitos

- Node.js 18+ instalado
- Screenlite Player Web configurado e funcionando
- Conhecimento básico de JSON e APIs REST

---

## Abordagem Recomendada: Seções Múltiplas (Sem Mudanças de Código)

Esta abordagem usa a arquitetura existente do Screenlite Player Web sem modificar nenhum arquivo do projeto.

---

## Passo 1: Preparar Servidor Backend

### 1.1. Criar Novo Projeto Node.js

```bash
mkdir screenlite-news-backend
cd screenlite-news-backend
npm init -y
npm install express node-fetch canvas cors dotenv
```

### 1.2. Criar Arquivo `.env`

```env
NEWS_API_KEY=sua_chave_newsapi_aqui
PORT=3000
```

### 1.3. Criar `server.js`

```javascript
require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const { createCanvas } = require('canvas')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const NEWS_API_KEY = process.env.NEWS_API_KEY

// Cache de notícias
let cachedPlaylist = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Endpoint principal
app.get('/api/playlist', async (req, res) => {
    try {
        const now = Date.now()

        // Retornar cache se válido
        if (cachedPlaylist && (now - lastFetch) < CACHE_DURATION) {
            console.log('Retornando notícias do cache')
            return res.json(cachedPlaylist)
        }

        console.log('Buscando novas notícias...')

        // Buscar notícias da API
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=br&pageSize=5&apiKey=${NEWS_API_KEY}`
        )

        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status !== 'ok') {
            throw new Error(`NewsAPI status: ${data.status}`)
        }

        // Transformar em playlist
        const playlist = await transformNewsToPlaylist(data.articles)

        // Atualizar cache
        cachedPlaylist = playlist
        lastFetch = now

        res.json(playlist)
    } catch (error) {
        console.error('Erro ao buscar notícias:', error)
        res.status(500).json({ error: error.message })
    }
})

// Transformar artigos em playlist JSON
async function transformNewsToPlaylist(articles) {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const imageItems = []
    const titleItems = []
    const footerItems = []

    for (const [index, article] of articles.entries()) {
        const newsId = `news_${Date.now()}_${index}`

        // 1. Item da imagem (usar imagem da notícia ou placeholder)
        imageItems.push({
            id: `${newsId}_image`,
            content_type: 'image',
            content_path: article.urlToImage || 'https://via.placeholder.com/1920x756/1E293B/FFFFFF?text=Sem+Imagem',
            duration: 10
        })

        // 2. Item do título (renderizado como imagem base64)
        const titleBase64 = await renderTitle(article.title || 'Sem título')
        titleItems.push({
            id: `${newsId}_title`,
            content_type: 'image',
            content_path: `data:image/png;base64,${titleBase64}`,
            duration: 10
        })

        // 3. Item do rodapé (renderizado como imagem base64)
        const publishedDate = new Date(article.publishedAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        const footerText = `${article.source.name || 'Fonte desconhecida'} | ${publishedDate}`
        const footerBase64 = await renderFooter(footerText)
        footerItems.push({
            id: `${newsId}_footer`,
            content_type: 'image',
            content_path: `data:image/png;base64,${footerBase64}`,
            duration: 10
        })
    }

    return [{
        id: 'news_playlist_live',
        start_date: now.toISOString().split('T')[0],
        end_date: tomorrow.toISOString().split('T')[0],
        start_time: '00:00:00',
        end_time: '23:59:59',
        width: 1920,
        height: 1080,
        sections: [
            {
                id: 'news_main_image',
                position: { x: 0, y: 0, width: 1920, height: 756, z_index: 1 },
                items: imageItems
            },
            {
                id: 'news_title_section',
                position: { x: 0, y: 756, width: 1920, height: 216, z_index: 2 },
                items: titleItems
            },
            {
                id: 'news_footer_section',
                position: { x: 0, y: 972, width: 1920, height: 108, z_index: 3 },
                items: footerItems
            }
        ]
    }]
}

// Renderizar título como imagem
async function renderTitle(text) {
    const canvas = createCanvas(1920, 216)
    const ctx = canvas.getContext('2d')

    // Background preto
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1920, 216)

    // Texto branco, bold, centralizado
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Quebrar texto se muito longo
    const maxWidth = 1840 // 40px padding em cada lado
    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    for (const word of words) {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
        } else {
            currentLine = testLine
        }
    }
    lines.push(currentLine.trim())

    // Limitar a 2 linhas
    const displayLines = lines.slice(0, 2)
    const lineHeight = 60
    const startY = 108 - ((displayLines.length - 1) * lineHeight / 2)

    displayLines.forEach((line, index) => {
        ctx.fillText(line, 960, startY + (index * lineHeight))
    })

    return canvas.toBuffer('image/png').toString('base64')
}

// Renderizar rodapé como imagem
async function renderFooter(text) {
    const canvas = createCanvas(1920, 108)
    const ctx = canvas.getContext('2d')

    // Background escuro
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(0, 0, 1920, 108)

    // Texto claro
    ctx.fillStyle = '#E2E8F0'
    ctx.font = '28px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 960, 54)

    return canvas.toBuffer('image/png').toString('base64')
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
    console.log(`📰 Endpoint de notícias: http://localhost:${PORT}/api/playlist`)
})
```

### 1.4. Testar o Servidor

```bash
node server.js
```

Abrir navegador em `http://localhost:3000/api/playlist` para ver o JSON gerado.

---

## Passo 2: Configurar Screenlite Player Web

### 2.1. Obter Chave da NewsAPI

1. Acessar https://newsapi.org
2. Criar conta gratuita
3. Copiar API Key
4. Adicionar no arquivo `.env` do backend

### 2.2. Configurar Player para Consumir API

No Screenlite Player Web, editar a configuração do adapter:

**Opção A: Via Interface (ConfigOverlay)**

1. Abrir o player no navegador
2. Clicar em "Configurações" (ícone de engrenagem)
3. Selecionar adapter: `network_file`
4. URL do arquivo: `http://localhost:3000/api/playlist`
5. Intervalo de polling: `60000` (60 segundos)
6. Salvar configuração

**Opção B: Via Código**

Editar arquivo de configuração ou código do player:

```typescript
import { NetworkFileAdapter } from './adapters/NetworkFileAdapter'

const adapter = new NetworkFileAdapter(
    'http://localhost:3000/api/playlist',
    60000 // Atualiza a cada 60 segundos
)
```

---

## Passo 3: Testar a Integração

### 3.1. Executar Backend

```bash
cd screenlite-news-backend
node server.js
```

### 3.2. Executar Player

```bash
cd /home/emanuel/web-player
npm run dev
```

### 3.3. Verificar Funcionamento

1. Abrir player no navegador
2. Aguardar carregamento das notícias
3. Verificar se notícias estão sendo exibidas corretamente
4. Verificar transições entre notícias (a cada 10 segundos)
5. Verificar atualização automática (a cada 60 segundos)

---

## Passo 4: Customizações Opcionais

### 4.1. Ajustar Cores e Fontes

Editar funções `renderTitle` e `renderFooter` no `server.js`:

```javascript
// Título com background gradiente
ctx.fillStyle = ctx.createLinearGradient(0, 0, 0, 216)
ctx.fillStyle.addColorStop(0, '#1E40AF')
ctx.fillStyle.addColorStop(1, '#1E293B')

// Título com sombra
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
ctx.shadowBlur = 10
ctx.shadowOffsetX = 2
ctx.shadowOffsetY = 2
```

### 4.2. Adicionar Logo da Fonte

```javascript
const { loadImage } = require('canvas')

async function renderFooter(text, logoUrl) {
    const canvas = createCanvas(1920, 108)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(0, 0, 1920, 108)

    // Logo (se existir)
    if (logoUrl) {
        const logo = await loadImage(logoUrl)
        ctx.drawImage(logo, 40, 24, 60, 60) // x, y, width, height
    }

    // Texto
    ctx.fillStyle = '#E2E8F0'
    ctx.font = '28px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 120, 54)

    return canvas.toBuffer('image/png').toString('base64')
}
```

### 4.3. Múltiplas Categorias de Notícias

```javascript
app.get('/api/playlist/:category', async (req, res) => {
    const category = req.params.category // sports, technology, business, etc.

    const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=br&category=${category}&pageSize=5&apiKey=${NEWS_API_KEY}`
    )

    // ... resto do código
})
```

### 4.4. Layout de 2 Notícias Lado a Lado

```javascript
async function transformNewsToPlaylistDual(articles) {
    // Pegar 2 notícias
    const leftNews = articles[0]
    const rightNews = articles[1]

    return [{
        id: 'news_dual',
        // ... datas e horários
        sections: [
            // Esquerda - Imagem
            { id: 'left_image', position: { x: 0, y: 0, width: 960, height: 756, z_index: 1 }, items: [/*...*/] },
            // Esquerda - Título
            { id: 'left_title', position: { x: 0, y: 756, width: 960, height: 216, z_index: 2 }, items: [/*...*/] },
            // Esquerda - Rodapé
            { id: 'left_footer', position: { x: 0, y: 972, width: 960, height: 108, z_index: 3 }, items: [/*...*/] },

            // Direita - Imagem
            { id: 'right_image', position: { x: 960, y: 0, width: 960, height: 756, z_index: 1 }, items: [/*...*/] },
            // Direita - Título
            { id: 'right_title', position: { x: 960, y: 756, width: 960, height: 216, z_index: 2 }, items: [/*...*/] },
            // Direita - Rodapé
            { id: 'right_footer', position: { x: 960, y: 972, width: 960, height: 108, z_index: 3 }, items: [/*...*/] },
        ]
    }]
}
```

---

## Passo 5: Deploy em Produção

### 5.1. Deploy do Backend

**Opção A: Heroku**

```bash
# Criar Procfile
echo "web: node server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku create screenlite-news-api
heroku config:set NEWS_API_KEY=sua_chave
git push heroku main
```

**Opção B: DigitalOcean / AWS**

```bash
# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start server.js --name screenlite-news
pm2 startup
pm2 save
```

**Opção C: Vercel (Serverless)**

```bash
npm install -g vercel
vercel
```

Criar `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### 5.2. Atualizar URL no Player

Após deploy, atualizar URL no player:

```typescript
const adapter = new NetworkFileAdapter(
    'https://screenlite-news-api.herokuapp.com/api/playlist',
    60000
)
```

---

## Passo 6: Monitoramento e Logs

### 6.1. Adicionar Logging

```javascript
const fs = require('fs')
const path = require('path')

function log(message) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}\n`

    console.log(logMessage.trim())

    // Salvar em arquivo
    fs.appendFileSync(
        path.join(__dirname, 'logs.txt'),
        logMessage
    )
}

// Usar
log('Buscando notícias da NewsAPI...')
```

### 6.2. Monitorar Erros

```javascript
process.on('uncaughtException', (error) => {
    log(`ERRO NÃO TRATADO: ${error.message}`)
    console.error(error)
})

process.on('unhandledRejection', (reason, promise) => {
    log(`PROMISE REJEITADA: ${reason}`)
    console.error(reason)
})
```

---

## Troubleshooting

### Problema: Notícias não aparecem no player

**Solução:**
1. Verificar se backend está rodando: `curl http://localhost:3000/api/playlist`
2. Verificar console do navegador por erros CORS
3. Verificar se URL do adapter está correta
4. Verificar se playlist JSON está válida (usar jsonlint.com)

### Problema: Textos cortados ou mal formatados

**Solução:**
1. Ajustar `maxWidth` nas funções de renderização
2. Limitar tamanho do texto antes de renderizar
3. Usar fontes com largura fixa
4. Implementar quebra de linha melhor

### Problema: Imagens das notícias não carregam

**Solução:**
1. Verificar se URLs das imagens são válidas
2. Verificar CORS das imagens
3. Usar placeholder para notícias sem imagem
4. Fazer proxy das imagens pelo backend

### Problema: NewsAPI retorna erro 429 (Too Many Requests)

**Solução:**
1. Aumentar `CACHE_DURATION` para 10-15 minutos
2. Reduzir frequência de polling no player
3. Usar plano pago da NewsAPI
4. Alternar entre múltiplas APIs

---

## Checklist de Implementação

- [ ] Backend Node.js criado
- [ ] NewsAPI key obtida e configurada
- [ ] Servidor testado localmente
- [ ] Player configurado com URL do backend
- [ ] Notícias sendo exibidas corretamente
- [ ] Transições funcionando
- [ ] Atualização automática funcionando
- [ ] Customizações de estilo aplicadas
- [ ] Backend deployed em produção
- [ ] Monitoramento e logs configurados
- [ ] Documentação interna criada

---

## Próximos Passos

1. Implementar filtros de notícias (categoria, palavras-chave)
2. Adicionar múltiplas fontes de notícias
3. Criar dashboard administrativo
4. Implementar analytics de visualizações
5. Adicionar notificações em tempo real via WebSocket
