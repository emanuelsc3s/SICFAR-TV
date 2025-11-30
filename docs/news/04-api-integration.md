# Integração com APIs de Notícias

## Visão Geral

Este documento detalha como integrar o Screenlite Player Web com APIs de notícias externas para exibir conteúdo dinâmico e atualizado.

---

## Arquitetura de Integração

```
API de Notícias (NewsAPI, RSS, etc.)
         ↓
Servidor Intermediário / Adapter
         ↓
Transformação para formato Playlist JSON
         ↓
NetworkFileAdapter / Custom Adapter
         ↓
Screenlite Player Web
```

---

## Opção 1: Usar NetworkFileAdapter com Servidor Intermediário

### 1. Criar API Backend que Consome Notícias

**Tecnologia sugerida:** Node.js + Express

```javascript
// server.js
const express = require('express')
const fetch = require('node-fetch')
const app = express()

// Endpoint que retorna notícias formatadas como Playlist JSON
app.get('/api/news/playlist', async (req, res) => {
    try {
        // 1. Buscar notícias de API externa
        const newsResponse = await fetch('https://newsapi.org/v2/top-headlines', {
            headers: {
                'X-Api-Key': process.env.NEWS_API_KEY
            }
        })
        const newsData = await newsResponse.json()

        // 2. Transformar em formato Playlist
        const playlist = transformNewsToPlaylist(newsData.articles)

        // 3. Retornar JSON
        res.json(playlist)
    } catch (error) {
        console.error('Erro ao buscar notícias:', error)
        res.status(500).json({ error: 'Falha ao buscar notícias' })
    }
})

function transformNewsToPlaylist(articles) {
    const now = new Date()
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // +24h

    // Criar items para cada seção (imagem, título, rodapé)
    const imageItems = []
    const titleItems = []
    const footerItems = []

    articles.slice(0, 5).forEach((article, index) => {
        const newsId = `news_${index + 1}`

        // Item da imagem
        imageItems.push({
            id: `${newsId}_image`,
            content_type: 'image',
            content_path: article.urlToImage || 'https://via.placeholder.com/1920x756',
            duration: 10
        })

        // Item do título (imagem renderizada)
        titleItems.push({
            id: `${newsId}_title`,
            content_type: 'image',
            content_path: `https://your-server.com/api/render/title?text=${encodeURIComponent(article.title)}`,
            duration: 10
        })

        // Item do rodapé (imagem renderizada)
        const footerText = `${article.source.name} | ${new Date(article.publishedAt).toLocaleString('pt-BR')}`
        footerItems.push({
            id: `${newsId}_footer`,
            content_type: 'image',
            content_path: `https://your-server.com/api/render/footer?text=${encodeURIComponent(footerText)}`,
            duration: 10
        })
    })

    return [{
        id: 'news_playlist_auto',
        start_date: now.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
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

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})
```

### 2. Configurar Player para Usar a API

No Screenlite Player Web, configurar o `NetworkFileAdapter`:

```typescript
const adapter = new NetworkFileAdapter(
    'https://your-server.com/api/news/playlist',
    60000 // Atualiza a cada 60 segundos
)
```

---

## Opção 2: Criar Adapter Customizado para NewsAPI

### 1. Implementar NewsAPIAdapter

**Arquivo:** `src/adapters/NewsAPIAdapter.ts` (a criar)

```typescript
import type { CMSAdapter, Playlist } from '../types'

export class NewsAPIAdapter implements CMSAdapter {
    private pollingInterval: number
    private intervalId: NodeJS.Timeout | null = null
    private apiKey: string
    private renderServiceUrl: string
    private callback: ((state: Playlist[]) => void) | null = null

    constructor(
        apiKey: string,
        renderServiceUrl: string,
        pollingInterval: number = 300000 // 5 minutos
    ) {
        this.apiKey = apiKey
        this.renderServiceUrl = renderServiceUrl
        this.pollingInterval = pollingInterval
    }

    private async fetchNews() {
        try {
            const response = await fetch(
                `https://newsapi.org/v2/top-headlines?country=br&pageSize=5`,
                {
                    headers: {
                        'X-Api-Key': this.apiKey,
                    },
                }
            )

            const data = await response.json()

            if (data.status === 'ok') {
                const playlist = await this.transformToPlaylist(data.articles)
                this.callback?.(playlist)
            }
        } catch (error) {
            console.error('NewsAPIAdapter: Failed to fetch news', error)
        }
    }

    private async transformToPlaylist(articles: any[]): Promise<Playlist[]> {
        const now = new Date()
        const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const imageItems = []
        const titleItems = []
        const footerItems = []

        for (const [index, article] of articles.entries()) {
            const newsId = `news_${index + 1}`

            // Renderizar título e rodapé como imagens
            const titleImageUrl = await this.renderText(
                article.title,
                { width: 1920, height: 216, fontSize: 48 }
            )
            const footerText = `${article.source.name} | ${new Date(article.publishedAt).toLocaleString('pt-BR')}`
            const footerImageUrl = await this.renderText(
                footerText,
                { width: 1920, height: 108, fontSize: 24 }
            )

            imageItems.push({
                id: `${newsId}_image`,
                content_type: 'image',
                content_path: article.urlToImage || 'https://via.placeholder.com/1920x756',
                duration: 10,
            })

            titleItems.push({
                id: `${newsId}_title`,
                content_type: 'image',
                content_path: titleImageUrl,
                duration: 10,
            })

            footerItems.push({
                id: `${newsId}_footer`,
                content_type: 'image',
                content_path: footerImageUrl,
                duration: 10,
            })
        }

        return [
            {
                id: 'news_playlist_auto',
                start_date: now.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                start_time: '00:00:00',
                end_time: '23:59:59',
                width: 1920,
                height: 1080,
                sections: [
                    {
                        id: 'news_main_image',
                        position: { x: 0, y: 0, width: 1920, height: 756, z_index: 1 },
                        items: imageItems,
                    },
                    {
                        id: 'news_title_section',
                        position: { x: 0, y: 756, width: 1920, height: 216, z_index: 2 },
                        items: titleItems,
                    },
                    {
                        id: 'news_footer_section',
                        position: { x: 0, y: 972, width: 1920, height: 108, z_index: 3 },
                        items: footerItems,
                    },
                ],
            },
        ]
    }

    private async renderText(
        text: string,
        options: { width: number; height: number; fontSize: number }
    ): Promise<string> {
        const response = await fetch(this.renderServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, ...options }),
        })

        const blob = await response.blob()
        return URL.createObjectURL(blob) // Retorna Data URL
    }

    connect() {
        this.fetchNews()
        this.intervalId = setInterval(() => this.fetchNews(), this.pollingInterval)
    }

    disconnect() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    onUpdate(callback: (state: Playlist[]) => void) {
        this.callback = callback
    }
}
```

### 2. Usar o Adapter

```typescript
import { NewsAPIAdapter } from './adapters/NewsAPIAdapter'

const adapter = new NewsAPIAdapter(
    'YOUR_NEWSAPI_KEY',
    'https://your-render-service.com/api/render',
    300000 // Atualiza a cada 5 minutos
)
```

---

## Serviço de Renderização de Texto para Imagem

### Implementação com Canvas (Node.js)

```javascript
// render-service.js
const express = require('express')
const { createCanvas } = require('canvas')
const app = express()

app.use(express.json())

app.post('/api/render', (req, res) => {
    const { text, width, height, fontSize, backgroundColor = '#000000', textColor = '#FFFFFF' } = req.body

    // Criar canvas
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Texto
    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Quebrar texto se muito longo
    const maxWidth = width - 80 // Padding
    const words = text.split(' ')
    let line = ''
    let y = height / 2

    for (const word of words) {
        const testLine = line + word + ' '
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && line.length > 0) {
            ctx.fillText(line, width / 2, y)
            line = word + ' '
            y += fontSize + 10
        } else {
            line = testLine
        }
    }
    ctx.fillText(line, width / 2, y)

    // Retornar imagem
    const buffer = canvas.toBuffer('image/png')
    res.set('Content-Type', 'image/png')
    res.send(buffer)
})

app.listen(4000, () => {
    console.log('Serviço de renderização rodando na porta 4000')
})
```

---

## APIs de Notícias Sugeridas

### 1. NewsAPI
**URL:** https://newsapi.org
**Preço:** Gratuito até 100 requisições/dia
**Países:** Brasil, EUA, Reino Unido, etc.

```bash
curl "https://newsapi.org/v2/top-headlines?country=br&apiKey=YOUR_KEY"
```

### 2. GNews
**URL:** https://gnews.io
**Preço:** Gratuito até 100 requisições/dia
**Idiomas:** Português, Inglês, etc.

```bash
curl "https://gnews.io/api/v4/top-headlines?lang=pt&token=YOUR_TOKEN"
```

### 3. Currents API
**URL:** https://currentsapi.services
**Preço:** Gratuito até 600 requisições/dia
**Regiões:** Brasil, América Latina

```bash
curl "https://api.currentsapi.services/v1/latest-news?language=pt&apiKey=YOUR_KEY"
```

### 4. RSS Feeds (Gratuito)
Consumir feeds RSS de portais brasileiros:

- G1: `https://g1.globo.com/rss/g1/`
- UOL: `https://rss.uol.com.br/feed/noticias.xml`
- Folha: `https://feeds.folha.uol.com.br/folha/cotidiano/rss091.xml`

**Parser recomendado:** `rss-parser` (npm)

```javascript
const Parser = require('rss-parser')
const parser = new Parser()

const feed = await parser.parseURL('https://g1.globo.com/rss/g1/')
const articles = feed.items.slice(0, 5)
```

---

## Estratégias de Cache e Otimização

### 1. Cache de Notícias no Servidor

```javascript
let cachedNews = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

app.get('/api/news/playlist', async (req, res) => {
    const now = Date.now()

    if (cachedNews && (now - lastFetch) < CACHE_DURATION) {
        return res.json(cachedNews)
    }

    // Buscar novas notícias
    const freshNews = await fetchAndTransformNews()
    cachedNews = freshNews
    lastFetch = now

    res.json(cachedNews)
})
```

### 2. Pré-renderização de Imagens

Renderizar títulos/rodapés antecipadamente e armazenar:

```javascript
// Salvar imagens renderizadas em disco ou CDN
const fs = require('fs')
const path = require('path')

async function renderAndSaveTitle(newsId, title) {
    const imageBuffer = await renderTextToImage(title, { width: 1920, height: 216 })
    const filePath = path.join(__dirname, 'rendered', `${newsId}_title.png`)
    fs.writeFileSync(filePath, imageBuffer)
    return `/rendered/${newsId}_title.png`
}
```

### 3. CDN para Imagens Renderizadas

Usar Cloudinary, AWS S3, ou similar para armazenar imagens renderizadas:

```javascript
const cloudinary = require('cloudinary').v2

async function uploadRenderedImage(buffer, newsId) {
    const result = await cloudinary.uploader.upload_stream(
        { public_id: `news/${newsId}`, resource_type: 'image' },
        (error, result) => {
            if (error) throw error
            return result.secure_url
        }
    )

    return result.secure_url
}
```

---

## Exemplo Completo de Integração

### 1. Backend (Express + NewsAPI + Canvas)

```javascript
const express = require('express')
const fetch = require('node-fetch')
const { createCanvas } = require('canvas')
const app = express()

const NEWS_API_KEY = process.env.NEWS_API_KEY

app.get('/api/news/playlist', async (req, res) => {
    try {
        // Buscar notícias
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=br&pageSize=5`, {
            headers: { 'X-Api-Key': NEWS_API_KEY }
        })
        const data = await response.json()

        // Transformar em playlist
        const playlist = await transformNewsToPlaylist(data.articles)
        res.json(playlist)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

async function transformNewsToPlaylist(articles) {
    const imageItems = []
    const titleItems = []
    const footerItems = []

    for (const [index, article] of articles.entries()) {
        const newsId = `news_${Date.now()}_${index}`

        imageItems.push({
            id: `${newsId}_image`,
            content_type: 'image',
            content_path: article.urlToImage,
            duration: 10
        })

        titleItems.push({
            id: `${newsId}_title`,
            content_type: 'image',
            content_path: `data:image/png;base64,${await renderTitle(article.title)}`,
            duration: 10
        })

        const footerText = `${article.source.name} | ${new Date(article.publishedAt).toLocaleString('pt-BR')}`
        footerItems.push({
            id: `${newsId}_footer`,
            content_type: 'image',
            content_path: `data:image/png;base64,${await renderFooter(footerText)}`,
            duration: 10
        })
    }

    return [{
        id: 'news_live',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '00:00:00',
        end_time: '23:59:59',
        width: 1920,
        height: 1080,
        sections: [
            { id: 'news_image', position: { x: 0, y: 0, width: 1920, height: 756, z_index: 1 }, items: imageItems },
            { id: 'news_title', position: { x: 0, y: 756, width: 1920, height: 216, z_index: 2 }, items: titleItems },
            { id: 'news_footer', position: { x: 0, y: 972, width: 1920, height: 108, z_index: 3 }, items: footerItems }
        ]
    }]
}

async function renderTitle(text) {
    const canvas = createCanvas(1920, 216)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1920, 216)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, 960, 108, 1840) // Max width 1840px

    return canvas.toBuffer().toString('base64')
}

async function renderFooter(text) {
    const canvas = createCanvas(1920, 108)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#1E293B'
    ctx.fillRect(0, 0, 1920, 108)

    ctx.fillStyle = '#E2E8F0'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, 960, 54)

    return canvas.toBuffer().toString('base64')
}

app.listen(3000)
```

### 2. Frontend (Configuração do Player)

```typescript
import { NetworkFileAdapter } from './adapters/NetworkFileAdapter'

const newsAdapter = new NetworkFileAdapter(
    'http://localhost:3000/api/news/playlist',
    60000 // Atualiza a cada 60 segundos
)
```

---

## Checklist de Implementação

- [ ] Escolher fonte de notícias (NewsAPI, RSS, etc.)
- [ ] Implementar backend de transformação
- [ ] Implementar serviço de renderização de texto
- [ ] Testar geração de playlist JSON
- [ ] Configurar adapter no player
- [ ] Implementar cache de notícias
- [ ] Otimizar renderização de imagens
- [ ] Adicionar tratamento de erros
- [ ] Monitorar performance
- [ ] Documentar API endpoints
