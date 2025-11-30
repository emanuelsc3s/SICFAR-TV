# Estrutura de Dados JSON para Notícias

## Abordagem 1: Usando Seções Múltiplas (Recomendada)

### Conceito

Cada notícia é composta por **3 seções independentes** que ocupam diferentes áreas da tela:

1. **news_image**: Área da imagem principal
2. **news_title**: Área do título/manchete
3. **news_footer**: Área do rodapé com metadados

### Exemplo Completo - Notícia Única em Tela Cheia

```json
[
  {
    "id": "news_playlist_01",
    "start_date": "2025-11-29",
    "end_date": "2025-12-31",
    "start_time": "06:00:00",
    "end_time": "22:00:00",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "news_main_image",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 756,
          "z_index": 1
        },
        "items": [
          {
            "id": "news_001_image",
            "content_type": "image",
            "content_path": "https://cdn.news.com/images/news_001.jpg",
            "duration": 10
          },
          {
            "id": "news_002_image",
            "content_type": "image",
            "content_path": "https://cdn.news.com/images/news_002.jpg",
            "duration": 10
          },
          {
            "id": "news_003_image",
            "content_type": "image",
            "content_path": "https://cdn.news.com/images/news_003.jpg",
            "duration": 10
          }
        ]
      },
      {
        "id": "news_title_section",
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
            "content_path": "https://cdn.news.com/rendered/news_001_title.png",
            "duration": 10
          },
          {
            "id": "news_002_title",
            "content_type": "image",
            "content_path": "https://cdn.news.com/rendered/news_002_title.png",
            "duration": 10
          },
          {
            "id": "news_003_title",
            "content_type": "image",
            "content_path": "https://cdn.news.com/rendered/news_003_title.png",
            "duration": 10
          }
        ]
      },
      {
        "id": "news_footer_section",
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
            "content_path": "https://cdn.news.com/rendered/news_001_footer.png",
            "duration": 10
          },
          {
            "id": "news_002_footer",
            "content_type": "image",
            "content_path": "https://cdn.news.com/rendered/news_002_footer.png",
            "duration": 10
          },
          {
            "id": "news_003_footer",
            "content_type": "image",
            "content_path": "https://cdn.news.com/rendered/news_003_footer.png",
            "duration": 10
          }
        ]
      }
    ]
  }
]
```

### Cálculo de Proporções (Full HD 1920x1080)

```
Altura total: 1080px
├─ Imagem:  70% = 756px  (y: 0)
├─ Título:  20% = 216px  (y: 756)
└─ Rodapé:  10% = 108px  (y: 972)
```

### Sincronização das Seções

**CRÍTICO**: Todas as seções devem ter:
- **Mesma quantidade de items** (3 notícias = 3 items em cada seção)
- **Mesma duração por item** (10 segundos para cada elemento da notícia)
- **IDs correlacionados** (news_001_image, news_001_title, news_001_footer)

Isso garante que imagem, título e rodapé da mesma notícia sejam exibidos simultaneamente.

---

## Exemplo 2: Layout de 2 Notícias Lado a Lado

```json
{
  "id": "news_dual_layout",
  "width": 1920,
  "height": 1080,
  "sections": [
    {
      "id": "news_left_image",
      "position": {
        "x": 0,
        "y": 0,
        "width": 960,
        "height": 756,
        "z_index": 1
      },
      "items": [
        {
          "id": "news_left_001_image",
          "content_type": "image",
          "content_path": "https://cdn.news.com/images/left_001.jpg",
          "duration": 8
        }
      ]
    },
    {
      "id": "news_left_title",
      "position": {
        "x": 0,
        "y": 756,
        "width": 960,
        "height": 216,
        "z_index": 2
      },
      "items": [
        {
          "id": "news_left_001_title",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/left_001_title.png",
          "duration": 8
        }
      ]
    },
    {
      "id": "news_left_footer",
      "position": {
        "x": 0,
        "y": 972,
        "width": 960,
        "height": 108,
        "z_index": 3
      },
      "items": [
        {
          "id": "news_left_001_footer",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/left_001_footer.png",
          "duration": 8
        }
      ]
    },
    {
      "id": "news_right_image",
      "position": {
        "x": 960,
        "y": 0,
        "width": 960,
        "height": 756,
        "z_index": 1
      },
      "items": [
        {
          "id": "news_right_001_image",
          "content_type": "image",
          "content_path": "https://cdn.news.com/images/right_001.jpg",
          "duration": 8
        }
      ]
    },
    {
      "id": "news_right_title",
      "position": {
        "x": 960,
        "y": 756,
        "width": 960,
        "height": 216,
        "z_index": 2
      },
      "items": [
        {
          "id": "news_right_001_title",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/right_001_title.png",
          "duration": 8
        }
      ]
    },
    {
      "id": "news_right_footer",
      "position": {
        "x": 960,
        "y": 972,
        "width": 960,
        "height": 108,
        "z_index": 3
      },
      "items": [
        {
          "id": "news_right_001_footer",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/right_001_footer.png",
          "duration": 8
        }
      ]
    }
  ]
}
```

---

## Exemplo 3: Notícia com Vídeo ao Invés de Imagem

```json
{
  "id": "news_with_video",
  "sections": [
    {
      "id": "news_video_main",
      "position": {
        "x": 0,
        "y": 0,
        "width": 1920,
        "height": 756,
        "z_index": 1
      },
      "items": [
        {
          "id": "news_video_001",
          "content_type": "video",
          "content_path": "https://cdn.news.com/videos/breaking_news.mp4",
          "duration": "auto",
          "muted": false
        }
      ]
    },
    {
      "id": "news_video_title",
      "position": {
        "x": 0,
        "y": 756,
        "width": 1920,
        "height": 216,
        "z_index": 2
      },
      "items": [
        {
          "id": "news_video_001_title",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/breaking_news_title.png",
          "duration": "auto"
        }
      ]
    },
    {
      "id": "news_video_footer",
      "position": {
        "x": 0,
        "y": 972,
        "width": 1920,
        "height": 108,
        "z_index": 3
      },
      "items": [
        {
          "id": "news_video_001_footer",
          "content_type": "image",
          "content_path": "https://cdn.news.com/rendered/breaking_news_footer.png",
          "duration": "auto"
        }
      ]
    }
  ]
}
```

**Nota**: Usando `"duration": "auto"`, título e rodapé permanecerão visíveis enquanto o vídeo estiver tocando.

---

## Abordagem 2: Novo Tipo de Item `news` (Alternativa)

### Novo Type Definition

```typescript
export type NewsItem = {
  id: string
  content_type: 'news'
  news_data: {
    image_url: string
    title: string
    footer: {
      category?: string
      source?: string
      date?: string
      author?: string
    }
  }
  duration: number
  style?: {
    title_font_size?: number
    title_color?: string
    footer_background_color?: string
    footer_text_color?: string
  }
}
```

### Exemplo JSON

```json
{
  "id": "news_item_001",
  "content_type": "news",
  "news_data": {
    "image_url": "https://cdn.news.com/images/breaking_news.jpg",
    "title": "Governo anuncia novo pacote de medidas econômicas para 2025",
    "footer": {
      "category": "Economia",
      "source": "Agência Brasil",
      "date": "2025-11-29 14:30",
      "author": "João Silva"
    }
  },
  "duration": 10,
  "style": {
    "title_font_size": 42,
    "title_color": "#FFFFFF",
    "footer_background_color": "#1E293B",
    "footer_text_color": "#E2E8F0"
  }
}
```

### Vantagens e Desvantagens

**Vantagens:**
- Estrutura de dados mais limpa e semântica
- Renderização nativa de texto (sem geração de imagens)
- Fácil atualização de estilos via JSON

**Desvantagens:**
- Requer desenvolvimento de novo componente `NewsItemRenderer`
- Mudanças no sistema de types
- Quebra compatibilidade com arquitetura atual
- Mais complexo para implementar cache de fontes/estilos

---

## Recomendação de Implementação

### Fase 1: Usar Abordagem 1 (Seções Múltiplas)
- Implementação imediata sem mudanças de código
- Testa viabilidade da feature
- Pode usar ferramentas externas para gerar imagens de texto

### Fase 2 (Opcional): Migrar para Abordagem 2
- Após validação da feature com usuários
- Desenvolver componente `NewsItemRenderer`
- Melhorar experiência de criação de conteúdo

---

## Ferramentas para Geração de Imagens de Texto

### Servidor (Node.js)
```bash
npm install canvas
# ou
npm install sharp
```

### Serviços Online
- Cloudinary (transformações de imagem)
- Imgix (renderização de texto sobre imagens)
- Bannerbear (API de geração de imagens)

### CLI Tools
```bash
# ImageMagick
convert -size 1920x216 -background black -fill white \
  -gravity center -font Arial -pointsize 48 \
  label:"Seu título aqui" output.png
```

### API Personalizada
Criar microserviço que recebe JSON e retorna imagem renderizada:

```
POST /api/render-news-title
{
  "text": "Título da notícia",
  "width": 1920,
  "height": 216,
  "fontSize": 48,
  "backgroundColor": "#000000",
  "textColor": "#FFFFFF"
}

Response: image/png (binary)
```
