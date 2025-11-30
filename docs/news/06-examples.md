# Exemplos Práticos - Feature de Notícias

## Exemplo 1: Notícia Única em Tela Cheia

### Visualização
```
┌─────────────────────────────────────────────────┐
│                                                 │
│        [Imagem da notícia principal]            │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  Governo anuncia novo pacote econômico         │
│                                                 │
├─────────────────────────────────────────────────┤
│ Economia | G1 | 29/11/2025 14:30               │
└─────────────────────────────────────────────────┘
```

### JSON Playlist
```json
[
  {
    "id": "single_news",
    "start_date": "2025-11-29",
    "end_date": "2025-11-30",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main_image",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 756,
          "z_index": 1
        },
        "items": [
          {
            "id": "news_001_img",
            "content_type": "image",
            "content_path": "https://example.com/economia_pacote.jpg",
            "duration": 15
          }
        ]
      },
      {
        "id": "title_section",
        "position": {
          "x": 0,
          "y": 756,
          "width": 1920,
          "height": 216,
          "z_index": 2
        },
        "items": [
          {
            "id": "news_001_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,iVBORw0KG...",
            "duration": 15
          }
        ]
      },
      {
        "id": "footer_section",
        "position": {
          "x": 0,
          "y": 972,
          "width": 1920,
          "height": 108,
          "z_index": 3
        },
        "items": [
          {
            "id": "news_001_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,iVBORw0KG...",
            "duration": 15
          }
        ]
      }
    ]
  }
]
```

---

## Exemplo 2: Rotação de 5 Notícias

### Comportamento
- Cada notícia exibida por 10 segundos
- Transição suave entre notícias
- Loop infinito ao final

### JSON Playlist
```json
[
  {
    "id": "rotating_news",
    "start_date": "2025-11-29",
    "end_date": "2025-12-31",
    "start_time": "06:00:00",
    "end_time": "22:00:00",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "rotating_images",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 756,
          "z_index": 1
        },
        "items": [
          {
            "id": "news_1_img",
            "content_type": "image",
            "content_path": "https://cdn.news.com/img1.jpg",
            "duration": 10
          },
          {
            "id": "news_2_img",
            "content_type": "image",
            "content_path": "https://cdn.news.com/img2.jpg",
            "duration": 10
          },
          {
            "id": "news_3_img",
            "content_type": "image",
            "content_path": "https://cdn.news.com/img3.jpg",
            "duration": 10
          },
          {
            "id": "news_4_img",
            "content_type": "image",
            "content_path": "https://cdn.news.com/img4.jpg",
            "duration": 10
          },
          {
            "id": "news_5_img",
            "content_type": "image",
            "content_path": "https://cdn.news.com/img5.jpg",
            "duration": 10
          }
        ]
      },
      {
        "id": "rotating_titles",
        "position": {
          "x": 0,
          "y": 756,
          "width": 1920,
          "height": 216,
          "z_index": 2
        },
        "items": [
          {
            "id": "news_1_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,ABC123...",
            "duration": 10
          },
          {
            "id": "news_2_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,DEF456...",
            "duration": 10
          },
          {
            "id": "news_3_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,GHI789...",
            "duration": 10
          },
          {
            "id": "news_4_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,JKL012...",
            "duration": 10
          },
          {
            "id": "news_5_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,MNO345...",
            "duration": 10
          }
        ]
      },
      {
        "id": "rotating_footers",
        "position": {
          "x": 0,
          "y": 972,
          "width": 1920,
          "height": 108,
          "z_index": 3
        },
        "items": [
          {
            "id": "news_1_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,PQR678...",
            "duration": 10
          },
          {
            "id": "news_2_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,STU901...",
            "duration": 10
          },
          {
            "id": "news_3_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,VWX234...",
            "duration": 10
          },
          {
            "id": "news_4_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,YZA567...",
            "duration": 10
          },
          {
            "id": "news_5_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,BCD890...",
            "duration": 10
          }
        ]
      }
    ]
  }
]
```

---

## Exemplo 3: Duas Notícias Lado a Lado

### Visualização
```
┌──────────────────────┬──────────────────────┐
│   [Imagem 1]         │   [Imagem 2]         │
│                      │                      │
│                      │                      │
├──────────────────────┼──────────────────────┤
│ Título Notícia 1     │ Título Notícia 2     │
├──────────────────────┼──────────────────────┤
│ Fonte 1 | Data       │ Fonte 2 | Data       │
└──────────────────────┴──────────────────────┘
```

### JSON Playlist
```json
[
  {
    "id": "dual_news",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "left_image",
        "position": { "x": 0, "y": 0, "width": 960, "height": 756, "z_index": 1 },
        "items": [
          { "id": "left_img", "content_type": "image", "content_path": "https://cdn.news.com/left.jpg", "duration": 12 }
        ]
      },
      {
        "id": "left_title",
        "position": { "x": 0, "y": 756, "width": 960, "height": 216, "z_index": 2 },
        "items": [
          { "id": "left_title", "content_type": "image", "content_path": "data:image/png;base64,ABC...", "duration": 12 }
        ]
      },
      {
        "id": "left_footer",
        "position": { "x": 0, "y": 972, "width": 960, "height": 108, "z_index": 3 },
        "items": [
          { "id": "left_footer", "content_type": "image", "content_path": "data:image/png;base64,DEF...", "duration": 12 }
        ]
      },
      {
        "id": "right_image",
        "position": { "x": 960, "y": 0, "width": 960, "height": 756, "z_index": 1 },
        "items": [
          { "id": "right_img", "content_type": "image", "content_path": "https://cdn.news.com/right.jpg", "duration": 12 }
        ]
      },
      {
        "id": "right_title",
        "position": { "x": 960, "y": 756, "width": 960, "height": 216, "z_index": 2 },
        "items": [
          { "id": "right_title", "content_type": "image", "content_path": "data:image/png;base64,GHI...", "duration": 12 }
        ]
      },
      {
        "id": "right_footer",
        "position": { "x": 960, "y": 972, "width": 960, "height": 108, "z_index": 3 },
        "items": [
          { "id": "right_footer", "content_type": "image", "content_path": "data:image/png;base64,JKL...", "duration": 12 }
        ]
      }
    ]
  }
]
```

---

## Exemplo 4: Notícia com Vídeo

### Descrição
- Vídeo da notícia ao invés de imagem estática
- Duração automática detectada do vídeo
- Áudio habilitado

### JSON Playlist
```json
[
  {
    "id": "video_news",
    "sections": [
      {
        "id": "video_section",
        "position": { "x": 0, "y": 0, "width": 1920, "height": 756, "z_index": 1 },
        "items": [
          {
            "id": "breaking_video",
            "content_type": "video",
            "content_path": "https://cdn.news.com/breaking_news.mp4",
            "duration": "auto",
            "muted": false
          }
        ]
      },
      {
        "id": "video_title",
        "position": { "x": 0, "y": 756, "width": 1920, "height": 216, "z_index": 2 },
        "items": [
          {
            "id": "video_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,TITLE...",
            "duration": "auto"
          }
        ]
      },
      {
        "id": "video_footer",
        "position": { "x": 0, "y": 972, "width": 1920, "height": 108, "z_index": 3 },
        "items": [
          {
            "id": "video_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,FOOTER...",
            "duration": "auto"
          }
        ]
      }
    ]
  }
]
```

---

## Exemplo 5: Ticker de Notícias (Rodapé Fixo)

### Visualização
```
┌─────────────────────────────────────────────────┐
│                                                 │
│        [Conteúdo principal - Vídeos/Imagens]    │
│                                                 │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ ÚLTIMAS: Notícia 1 • Notícia 2 • Notícia 3...  │
└─────────────────────────────────────────────────┘
```

### JSON Playlist
```json
[
  {
    "id": "main_with_ticker",
    "sections": [
      {
        "id": "main_content",
        "position": { "x": 0, "y": 0, "width": 1920, "height": 972, "z_index": 1 },
        "items": [
          { "id": "content_1", "content_type": "video", "content_path": "demo/video1.mp4", "duration": 30 },
          { "id": "content_2", "content_type": "image", "content_path": "demo/image1.jpg", "duration": 10 }
        ]
      },
      {
        "id": "news_ticker",
        "position": { "x": 0, "y": 972, "width": 1920, "height": 108, "z_index": 10 },
        "items": [
          {
            "id": "ticker_1",
            "content_type": "image",
            "content_path": "https://your-server.com/api/ticker?news=latest",
            "duration": 8
          }
        ]
      }
    ]
  }
]
```

**Backend para gerar ticker animado:**

```javascript
const { createCanvas } = require('canvas')

app.get('/api/ticker', async (req, res) => {
    const canvas = createCanvas(1920, 108)
    const ctx = canvas.getContext('2d')

    // Background vermelho (estilo breaking news)
    ctx.fillStyle = '#DC2626'
    ctx.fillRect(0, 0, 1920, 108)

    // Label "ÚLTIMAS"
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 32px Arial'
    ctx.fillText('ÚLTIMAS:', 20, 60)

    // Notícias em sequência
    const news = [
        'Governo anuncia novo pacote',
        'Bolsa sobe 2% no pregão',
        'Seleção vence amistoso'
    ]

    let x = 200
    news.forEach((item, index) => {
        ctx.fillText(item, x, 60)
        x += ctx.measureText(item).width + 40

        if (index < news.length - 1) {
            ctx.fillText('•', x, 60)
            x += 40
        }
    })

    const buffer = canvas.toBuffer('image/png')
    res.set('Content-Type', 'image/png')
    res.send(buffer)
})
```

---

## Exemplo 6: Grid de 4 Notícias

### Visualização
```
┌──────────────┬──────────────┐
│   News 1     │   News 2     │
│   [Img]      │   [Img]      │
│   Título     │   Título     │
├──────────────┼──────────────┤
│   News 3     │   News 4     │
│   [Img]      │   [Img]      │
│   Título     │   Título     │
└──────────────┴──────────────┘
```

### JSON Playlist
```json
[
  {
    "id": "grid_news",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "news1_img",
        "position": { "x": 0, "y": 0, "width": 960, "height": 405, "z_index": 1 },
        "items": [{ "id": "n1_img", "content_type": "image", "content_path": "https://cdn.news.com/1.jpg", "duration": 15 }]
      },
      {
        "id": "news1_title",
        "position": { "x": 0, "y": 405, "width": 960, "height": 135, "z_index": 2 },
        "items": [{ "id": "n1_title", "content_type": "image", "content_path": "data:image/png;base64,...", "duration": 15 }]
      },
      {
        "id": "news2_img",
        "position": { "x": 960, "y": 0, "width": 960, "height": 405, "z_index": 1 },
        "items": [{ "id": "n2_img", "content_type": "image", "content_path": "https://cdn.news.com/2.jpg", "duration": 15 }]
      },
      {
        "id": "news2_title",
        "position": { "x": 960, "y": 405, "width": 960, "height": 135, "z_index": 2 },
        "items": [{ "id": "n2_title", "content_type": "image", "content_path": "data:image/png;base64,...", "duration": 15 }]
      },
      {
        "id": "news3_img",
        "position": { "x": 0, "y": 540, "width": 960, "height": 405, "z_index": 1 },
        "items": [{ "id": "n3_img", "content_type": "image", "content_path": "https://cdn.news.com/3.jpg", "duration": 15 }]
      },
      {
        "id": "news3_title",
        "position": { "x": 0, "y": 945, "width": 960, "height": 135, "z_index": 2 },
        "items": [{ "id": "n3_title", "content_type": "image", "content_path": "data:image/png;base64,...", "duration": 15 }]
      },
      {
        "id": "news4_img",
        "position": { "x": 960, "y": 540, "width": 960, "height": 405, "z_index": 1 },
        "items": [{ "id": "n4_img", "content_type": "image", "content_path": "https://cdn.news.com/4.jpg", "duration": 15 }]
      },
      {
        "id": "news4_title",
        "position": { "x": 960, "y": 945, "width": 960, "height": 135, "z_index": 2 },
        "items": [{ "id": "n4_title", "content_type": "image", "content_path": "data:image/png;base64,...", "duration": 15 }]
      }
    ]
  }
]
```

---

## Exemplo 7: Agendamento por Horário

### Caso de Uso
- **06:00-12:00**: Notícias de economia
- **12:00-18:00**: Notícias gerais
- **18:00-23:00**: Notícias de esportes

### JSON Playlist (3 playlists diferentes)
```json
[
  {
    "id": "morning_economy",
    "start_time": "06:00:00",
    "end_time": "11:59:59",
    "sections": [
      // Seções com notícias de economia
    ]
  },
  {
    "id": "afternoon_general",
    "start_time": "12:00:00",
    "end_time": "17:59:59",
    "sections": [
      // Seções com notícias gerais
    ]
  },
  {
    "id": "evening_sports",
    "start_time": "18:00:00",
    "end_time": "22:59:59",
    "sections": [
      // Seções com notícias de esportes
    ]
  }
]
```

---

## Código Backend para Gerar Exemplos

### Exemplo Completo com NewsAPI

```javascript
const express = require('express')
const fetch = require('node-fetch')
const { createCanvas } = require('canvas')

const app = express()

// Exemplo 1: Notícia única
app.get('/api/single-news', async (req, res) => {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=br&pageSize=1&apiKey=${API_KEY}`)
    const data = await response.json()
    const article = data.articles[0]

    const playlist = {
        id: 'single_news',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '00:00:00',
        end_time: '23:59:59',
        width: 1920,
        height: 1080,
        sections: [
            {
                id: 'image',
                position: { x: 0, y: 0, width: 1920, height: 756, z_index: 1 },
                items: [{ id: 'img', content_type: 'image', content_path: article.urlToImage, duration: 15 }]
            },
            {
                id: 'title',
                position: { x: 0, y: 756, width: 1920, height: 216, z_index: 2 },
                items: [{ id: 'title', content_type: 'image', content_path: await renderTitle(article.title), duration: 15 }]
            },
            {
                id: 'footer',
                position: { x: 0, y: 972, width: 1920, height: 108, z_index: 3 },
                items: [{ id: 'footer', content_type: 'image', content_path: await renderFooter(article.source.name), duration: 15 }]
            }
        ]
    }

    res.json([playlist])
})

// Exemplo 2: Múltiplas notícias
app.get('/api/rotating-news', async (req, res) => {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=br&pageSize=5&apiKey=${API_KEY}`)
    const data = await response.json()

    const imageItems = []
    const titleItems = []
    const footerItems = []

    for (const [index, article] of data.articles.entries()) {
        imageItems.push({
            id: `img_${index}`,
            content_type: 'image',
            content_path: article.urlToImage,
            duration: 10
        })

        titleItems.push({
            id: `title_${index}`,
            content_type: 'image',
            content_path: await renderTitle(article.title),
            duration: 10
        })

        footerItems.push({
            id: `footer_${index}`,
            content_type: 'image',
            content_path: await renderFooter(article.source.name),
            duration: 10
        })
    }

    const playlist = {
        id: 'rotating',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '00:00:00',
        end_time: '23:59:59',
        width: 1920,
        height: 1080,
        sections: [
            { id: 'images', position: { x: 0, y: 0, width: 1920, height: 756, z_index: 1 }, items: imageItems },
            { id: 'titles', position: { x: 0, y: 756, width: 1920, height: 216, z_index: 2 }, items: titleItems },
            { id: 'footers', position: { x: 0, y: 972, width: 1920, height: 108, z_index: 3 }, items: footerItems }
        ]
    }

    res.json([playlist])
})

async function renderTitle(text) {
    const canvas = createCanvas(1920, 216)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1920, 216)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, 960, 108, 1840)
    return `data:image/png;base64,${canvas.toBuffer().toString('base64')}`
}

async function renderFooter(source) {
    const canvas = createCanvas(1920, 108)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(0, 0, 1920, 108)
    ctx.fillStyle = '#E2E8F0'
    ctx.font = '28px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${source} | ${new Date().toLocaleString('pt-BR')}`, 960, 54)
    return `data:image/png;base64,${canvas.toBuffer().toString('base64')}`
}

app.listen(3000)
```

---

## Testes Recomendados

1. **Teste de sincronização**: Verificar se imagem, título e rodapé trocam juntos
2. **Teste de loop**: Confirmar que notícias voltam ao início após última
3. **Teste de atualização**: Verificar se novas notícias aparecem após polling
4. **Teste de fallback**: Confirmar placeholder quando imagem falha
5. **Teste de performance**: Monitorar uso de memória com 10+ notícias
6. **Teste de cache**: Verificar se cache evita requisições desnecessárias
7. **Teste de agendamento**: Confirmar troca de playlist por horário
