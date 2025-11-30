# Componentes Necessários para Feature de Notícias

## Abordagem 1: Usando Arquitetura Atual (Sem Mudanças de Código)

### Componentes Existentes que Serão Utilizados

#### 1. SectionContainer
**Arquivo:** [src/SectionContainer.tsx](../../src/SectionContainer.tsx)

**Função:** Posiciona e renderiza cada seção da notícia (imagem, título, rodapé)

**Como será usado:**
```tsx
// Para notícia com 3 seções
<SectionContainer section={newsImageSection} />    // Seção da imagem
<SectionContainer section={newsTitleSection} />    // Seção do título
<SectionContainer section={newsFooterSection} />   // Seção do rodapé
```

**Não requer mudanças** ✅

---

#### 2. MediaItemRenderer
**Arquivo:** [src/MediaItemRenderer.tsx](../../src/MediaItemRenderer.tsx)

**Função:** Renderiza cada item (imagem ou vídeo)

**Como será usado:**
- Renderiza imagem principal da notícia
- Renderiza imagem renderizada do título
- Renderiza imagem renderizada do rodapé

**Não requer mudanças** ✅

---

#### 3. useSectionMediaItems
**Arquivo:** [src/hooks/useSectionMediaItems.ts](../../src/hooks/useSectionMediaItems.ts)

**Função:** Converte `Item[]` em `MediaItem[]` processados

**Como será usado:**
- Processa items das 3 seções de cada notícia
- Detecta duração automática se usar vídeos
- Gerencia estado de muted/hidden

**Não requer mudanças** ✅

---

#### 4. useMediaSequence
**Arquivo:** [src/hooks/useMediaSequence.ts](../../src/hooks/useMediaSequence.ts)

**Função:** Calcula qual item está sendo exibido no momento

**Como será usado:**
- Sincroniza exibição de imagem, título e rodapé
- Garante transição simultânea entre notícias

**Não requer mudanças** ✅

---

### Fluxo de Renderização Completo

```
Playlist JSON (3 seções por notícia)
         ↓
usePlaylist() - seleciona playlist ativa
         ↓
PlaylistRenderer
         ↓
┌────────────────────────────────────────┐
│  SectionContainer (news_image)         │
│    ↓                                   │
│  useSectionMediaItems()                │
│    ↓                                   │
│  useMediaSequence()                    │
│    ↓                                   │
│  MediaRenderer                         │
│    ↓                                   │
│  MediaItemRenderer (image)             │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  SectionContainer (news_title)         │
│    ↓                                   │
│  useSectionMediaItems()                │
│    ↓                                   │
│  useMediaSequence()                    │
│    ↓                                   │
│  MediaRenderer                         │
│    ↓                                   │
│  MediaItemRenderer (image)             │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  SectionContainer (news_footer)        │
│    ↓                                   │
│  useSectionMediaItems()                │
│    ↓                                   │
│  useMediaSequence()                    │
│    ↓                                   │
│  MediaRenderer                         │
│    ↓                                   │
│  MediaItemRenderer (image)             │
└────────────────────────────────────────┘
```

---

## Abordagem 2: Novo Componente NewsItemRenderer (Alternativa)

Se optar por renderizar notícias com texto nativo (sem gerar imagens), será necessário criar novos componentes.

### 1. NewsItemRenderer (NOVO)

**Arquivo:** `src/NewsItemRenderer.tsx` (a criar)

**Responsabilidade:** Renderizar notícia completa com HTML/CSS

```tsx
import { useMemo } from 'react'
import type { NewsItem } from './types'

type Props = {
    item: NewsItem
}

export const NewsItemRenderer = ({ item }: Props) => {
    const { news_data, style } = item

    const containerStyle = useMemo(() => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
    }), [])

    const imageStyle = useMemo(() => ({
        width: '100%',
        height: '70%',
        objectFit: 'cover' as const,
    }), [])

    const titleStyle = useMemo(() => ({
        width: '100%',
        height: '20%',
        backgroundColor: '#000000',
        color: style?.title_color || '#FFFFFF',
        fontSize: `${style?.title_font_size || 42}px`,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center' as const,
    }), [style])

    const footerStyle = useMemo(() => ({
        width: '100%',
        height: '10%',
        backgroundColor: style?.footer_background_color || '#1E293B',
        color: style?.footer_text_color || '#E2E8F0',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
    }), [style])

    return (
        <div style={containerStyle}>
            <img src={news_data.image_url} alt="News" style={imageStyle} />

            <div style={titleStyle}>
                {news_data.title}
            </div>

            <div style={footerStyle}>
                <span>{news_data.footer.category}</span>
                <span>{news_data.footer.source}</span>
                <span>{news_data.footer.date}</span>
            </div>
        </div>
    )
}
```

---

### 2. Modificação no MediaItemRenderer (NECESSÁRIA)

**Arquivo:** [src/MediaItemRenderer.tsx](../../src/MediaItemRenderer.tsx)

**Mudanças necessárias:**

```tsx
import { useEffect, useMemo, useRef } from 'react'
import type { MediaItem, NewsItem } from './types'
import { useMediaItemPlaybackTracker } from './utils/useMediaItemPlaybackTracker'
import { NewsItemRenderer } from './NewsItemRenderer' // NOVO IMPORT

type Props = {
    item: MediaItem | NewsItem // MODIFICADO: aceita NewsItem também
}

export const MediaItemRenderer = ({ item }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useMediaItemPlaybackTracker(item.id, item.hidden)

    // NOVO: Detectar tipo de item
    const isNewsItem = 'news_data' in item

    // Se for NewsItem, renderizar componente especializado
    if (isNewsItem) {
        return <NewsItemRenderer item={item as NewsItem} />
    }

    // Resto do código existente para image/video...
    useEffect(() => {
        const video = videoRef.current

        if (item.type !== 'video' || !video) return

        if (item.hidden) {
            video.pause()
            video.currentTime = 0
        } else {
            video.play().catch(() => {})
        }
    }, [item.type, item.hidden])

    const mediaStyle = useMemo(() => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        zIndex: item.hidden ? 0 : 1,
    }), [item.hidden])

    if (!item.preload && item.hidden) return null

    return item.type === 'image' ? (
        <img key={item.id} src={item.src} style={mediaStyle} />
    ) : (
        <video
            key={item.id}
            ref={videoRef}
            style={mediaStyle}
            loop
            muted={item.muted}
        >
            <source src={item.src} type="video/mp4" />
        </video>
    )
}
```

---

### 3. Atualização nos Types (NECESSÁRIA)

**Arquivo:** [src/types.ts](../../src/types.ts)

**Adicionar:**

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
    hidden: boolean
    preload: boolean
    style?: {
        title_font_size?: number
        title_color?: string
        footer_background_color?: string
        footer_text_color?: string
    }
}

// Modificar Item para aceitar news
export type Item = {
    id: string
    content_type: 'image' | 'video' | 'news' | string
    content_path?: string // Tornar opcional
    news_data?: NewsItem['news_data'] // Adicionar
    duration: number | 'auto'
    muted?: boolean
    style?: NewsItem['style'] // Adicionar
}
```

---

### 4. Modificação no useSectionMediaItems (NECESSÁRIA)

**Arquivo:** [src/hooks/useSectionMediaItems.ts](../../src/hooks/useSectionMediaItems.ts)

**Adicionar processamento para tipo 'news':**

```typescript
export const useSectionMediaItems = (sectionItems: Item[], elapsedSinceStart: number) => {
    // ... código existente ...

    useEffect(() => {
        // ... código de detecção de durações ...

        let items = sectionItems.map(item => {
            let durationMs: number

            if (item.duration === 'auto') {
                durationMs = videoDurations.get(item.id) || 10000
            } else {
                durationMs = item.duration * 1000
            }

            // NOVO: Processar item tipo 'news'
            if (item.content_type === 'news') {
                return {
                    id: item.id,
                    content_type: 'news',
                    news_data: item.news_data!,
                    duration: durationMs,
                    hidden: true,
                    preload: false,
                    style: item.style
                }
            }

            // Processamento existente para image/video
            return {
                id: item.id,
                src: item.content_path!,
                type: item.content_type,
                duration: durationMs,
                hidden: true,
                preload: false,
                muted: item.muted !== undefined ? item.muted : true
            }
        })

        // ... resto do código ...
    }, [sectionItems, totalDurationRef, videoDurations])

    return { mediaItems, setMediaItems, totalDurationRef }
}
```

---

## Resumo de Mudanças por Abordagem

### Abordagem 1 (Seções Múltiplas)
- ✅ **0 arquivos** a modificar
- ✅ **0 arquivos** a criar
- ✅ Usa 100% da arquitetura existente
- ⚠️ Requer geração externa de imagens para texto

### Abordagem 2 (Novo Tipo 'news')
- 📝 **1 arquivo** a criar: `NewsItemRenderer.tsx`
- ✏️ **3 arquivos** a modificar:
  - `MediaItemRenderer.tsx`
  - `types.ts`
  - `hooks/useSectionMediaItems.ts`
- ✅ Renderização nativa de texto
- ⚠️ Maior complexidade de implementação

---

## Recomendação

**Começar com Abordagem 1** para:
1. Validar feature rapidamente
2. Não introduzir bugs
3. Manter compatibilidade total
4. Testar com usuários reais

**Evoluir para Abordagem 2** se:
1. Usuários demandarem mudanças frequentes de texto
2. Performance de geração de imagens for problema
3. Necessidade de textos muito longos ou dinâmicos
