# Documentação Completa - Formato playlist_data.json

Esta documentação descreve todos os campos, propriedades e comandos suportados no arquivo de configuração de playlists do **Screenlite Player Web**.

---

## Índice

1. [Estrutura Geral](#estrutura-geral)
2. [Propriedades da Playlist](#propriedades-da-playlist)
3. [Propriedades de Sections](#propriedades-de-sections)
4. [Propriedades de Position](#propriedades-de-position)
5. [Propriedades de Items](#propriedades-de-items)
6. [Tipos de Conteúdo Suportados](#tipos-de-conteúdo-suportados)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Recursos Avançados](#recursos-avançados)
9. [Validações e Restrições](#validações-e-restrições)
10. [Fluxo de Processamento](#fluxo-de-processamento)
11. [Configurações Globais](#configurações-globais)
12. [Adapters CMS Suportados](#adapters-cms-suportados)

---

## Estrutura Geral

O arquivo `playlist_data.json` deve conter um **array de objetos Playlist**:

```typescript
Playlist[]
```

```json
[
  {
    "id": "playlist_1",
    "start_date": "...",
    "end_date": "...",
    ...
  },
  {
    "id": "playlist_2",
    ...
  }
]
```

---

## Propriedades da Playlist

Cada objeto playlist no array raiz possui as seguintes propriedades:

### Tipo TypeScript
```typescript
export type Playlist = {
    id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    width: number
    height: number
    sections: Section[]
}
```

### Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | ✅ Sim | Identificador único da playlist |
| `start_date` | string | ✅ Sim | Data de início no formato `YYYY-MM-DD` (UTC) |
| `end_date` | string | ✅ Sim | Data de término no formato `YYYY-MM-DD` (UTC) |
| `start_time` | string | ✅ Sim | Hora de início no formato `HH:MM:SS` (24h UTC) |
| `end_time` | string | ✅ Sim | Hora de término no formato `HH:MM:SS` (24h UTC) |
| `width` | number | ✅ Sim | Largura da tela em pixels (ex: 1920, 1280) |
| `height` | number | ✅ Sim | Altura da tela em pixels (ex: 1080, 720) |
| `sections` | Section[] | ✅ Sim | Array de seções (regiões) da playlist |

### Notas Importantes

#### Agendamento de Horários
- A playlist é ativa quando o horário atual está entre `start_time` e `end_time`
- Suporta agendamentos "overnight" (quando `end_time` < `start_time`, a exibição continua até o dia seguinte)
- O horário `00:00:00` a `23:59:59` significa "o dia inteiro"
- Todas as datas/horas são processadas em UTC com conversão automática para timezone local

#### Exemplos de Agendamento
```json
// Playlist ativa o dia todo
"start_time": "00:00:00",
"end_time": "23:59:59"

// Playlist ativa durante horário comercial
"start_time": "08:00:00",
"end_time": "18:00:00"

// Playlist ativa durante a noite (overnight)
"start_time": "18:00:00",
"end_time": "06:00:00"
```

---

## Propriedades de Sections

Cada seção representa uma região retangular na tela onde o conteúdo será exibido.

### Tipo TypeScript
```typescript
export type Section = {
    id: string
    position: Position
    items: Item[]
}
```

### Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | ✅ Sim | Identificador único da seção |
| `position` | Position | ✅ Sim | Objeto com propriedades de posicionamento |
| `items` | Item[] | ✅ Sim | Array de itens de mídia da seção |

### Comportamento de Sections

- Múltiplas seções podem ser exibidas simultaneamente
- Cada seção possui sua própria sequência de reprodução independente
- Seções podem se sobrepor (controlado por `z_index`)
- O posicionamento é relativo à resolução definida na playlist

---

## Propriedades de Position

Define o posicionamento e dimensões de uma seção na tela.

### Tipo TypeScript
```typescript
type Position = {
    x: number
    y: number
    width: number
    height: number
    z_index: number
}
```

### Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `x` | number | ✅ Sim | Coordenada X inicial (pixels do canto superior esquerdo) |
| `y` | number | ✅ Sim | Coordenada Y inicial (pixels do canto superior esquerdo) |
| `width` | number | ✅ Sim | Largura da seção em pixels |
| `height` | number | ✅ Sim | Altura da seção em pixels |
| `z_index` | number | ✅ Sim | Índice de camada Z (maior = mais acima) |

### Sistema de Coordenadas

```
(0,0) ─────────────────> x
  │
  │
  │
  │
  ↓
  y
```

- Origem (0,0) está no canto superior esquerdo
- `x` aumenta para a direita
- `y` aumenta para baixo
- A aplicação aplica escalonamento automático para adaptar ao tamanho real da tela

### Exemplos de Posicionamento

#### Tela dividida ao meio (vertical)
```json
// Para resolução 1280x720
{
  "sections": [
    {
      "id": "left",
      "position": {
        "x": 0,
        "y": 0,
        "width": 640,
        "height": 720,
        "z_index": 1
      }
    },
    {
      "id": "right",
      "position": {
        "x": 640,
        "y": 0,
        "width": 640,
        "height": 720,
        "z_index": 1
      }
    }
  ]
}
```

#### Banner superior + conteúdo principal
```json
// Para resolução 1920x1080
{
  "sections": [
    {
      "id": "banner",
      "position": {
        "x": 0,
        "y": 0,
        "width": 1920,
        "height": 200,
        "z_index": 2
      }
    },
    {
      "id": "main",
      "position": {
        "x": 0,
        "y": 200,
        "width": 1920,
        "height": 880,
        "z_index": 1
      }
    }
  ]
}
```

#### Grade 2x2
```json
// Para resolução 1920x1080
{
  "sections": [
    {"id": "top-left", "position": {"x": 0, "y": 0, "width": 960, "height": 540, "z_index": 1}},
    {"id": "top-right", "position": {"x": 960, "y": 0, "width": 960, "height": 540, "z_index": 1}},
    {"id": "bottom-left", "position": {"x": 0, "y": 540, "width": 960, "height": 540, "z_index": 1}},
    {"id": "bottom-right", "position": {"x": 960, "y": 540, "width": 960, "height": 540, "z_index": 1}}
  ]
}
```

---

## Propriedades de Items

Cada item representa uma peça de conteúdo de mídia (imagem ou vídeo) que será exibida.

### Tipo TypeScript
```typescript
export type Item = {
    id: string
    content_type: 'image' | 'video' | string
    content_path: string
    duration: number | 'auto'
    muted?: boolean
}
```

### Referência de Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | ✅ Sim | Identificador único do item |
| `content_type` | string | ✅ Sim | Tipo de conteúdo: `"image"` ou `"video"` |
| `content_path` | string | ✅ Sim | Caminho relativo ou URL absoluta do arquivo |
| `duration` | number \| `"auto"` | ✅ Sim | Duração em **SEGUNDOS**, ou `"auto"` para usar duração real do vídeo |
| `muted` | boolean | ❌ Não | Se `false`, vídeo toca com áudio (padrão: `true`) |

### Comportamento de Items

- Items dentro de uma seção são exibidos **sequencialmente**
- Quando o último item termina, a sequência recomeça do primeiro (loop infinito)
- Se uma seção possui apenas 1 item, ele é duplicado internamente para permitir transições suaves
- A duração é convertida para milissegundos internamente (`duration * 1000`)

### Caminhos de Arquivo

#### Caminhos Relativos (recomendado)
```json
{
  "content_path": "demo/video.mp4"
}
// Resolve para: /public/demo/video.mp4
```

#### URLs Absolutas
```json
{
  "content_path": "https://example.com/media/video.mp4"
}
```

---

## Tipos de Conteúdo Suportados

### Imagens (`content_type: "image"`)

**Formatos suportados:**
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)
- AVIF (`.avif`)

**Comportamento:**
- A imagem é exibida durante a duração especificada
- Mantém aspect ratio com `object-fit: cover`
- Preenche toda a área da seção

**Exemplo:**
```json
{
  "id": "banner_1",
  "content_type": "image",
  "content_path": "demo/banner.png",
  "duration": 10
}
```

### Vídeos (`content_type: "video"`)

**Formatos suportados:**
- MP4 (H.264) (`.mp4`)
- WebM (`.webm`)

**Comportamento:**
- O vídeo é reproduzido em loop durante a duração especificada
- Por padrão, reproduzido **sem áudio** (`muted: true`)
- Use `muted: false` para reproduzir com áudio (ver exemplos abaixo)
- Mantém aspect ratio com `object-fit: cover`
- Pré-carregado automaticamente 5 segundos antes da exibição

**Exemplo sem áudio (padrão):**
```json
{
  "id": "promo_video",
  "content_type": "video",
  "content_path": "demo/promo.mp4",
  "duration": 30
}
```

**Exemplo COM áudio:**
```json
{
  "id": "comunicado_corporativo",
  "content_type": "video",
  "content_path": "demo/comunicado.mp4",
  "duration": 45,
  "muted": false
}
```

**Exemplo COM duração automática (NOVO!):**
```json
{
  "id": "video_completo",
  "content_type": "video",
  "content_path": "demo/video.mp4",
  "duration": "auto",
  "muted": false
}
```
Neste caso, o vídeo tocará **uma vez completo** usando sua duração real, sem precisar especificar o tempo manualmente.

**Notas sobre vídeos:**
- Se `duration` for um número > duração real do vídeo, ele repetirá automaticamente
- Se `duration` for um número < duração real do vídeo, ele será cortado no tempo especificado
- Se `duration: "auto"`, o vídeo usa sua duração real (ideal para vídeos que devem tocar completamente)
- **Importante sobre áudio:** Vídeos com `muted: false` só tocarão áudio automaticamente se o navegador permitir. Em alguns casos, pode ser necessário interação do usuário primeiro.

---

## Exemplos Práticos

### Exemplo 1: Playlist Simples (Tela Cheia)

```json
[
  {
    "id": "simple_playlist",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "fullscreen",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080,
          "z_index": 1
        },
        "items": [
          {
            "id": "slide1",
            "content_type": "image",
            "content_path": "images/slide1.jpg",
            "duration": 10
          },
          {
            "id": "slide2",
            "content_type": "image",
            "content_path": "images/slide2.jpg",
            "duration": 10
          },
          {
            "id": "video1",
            "content_type": "video",
            "content_path": "videos/promo.mp4",
            "duration": 20
          }
        ]
      }
    ]
  }
]
```

### Exemplo 2: Tela Dividida (Esquerda + Direita)

```json
[
  {
    "id": "split_screen",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1280,
    "height": 720,
    "sections": [
      {
        "id": "left",
        "position": {
          "x": 0,
          "y": 0,
          "width": 640,
          "height": 720,
          "z_index": 1
        },
        "items": [
          {
            "id": "left_1",
            "content_type": "image",
            "content_path": "demo/left_1.avif",
            "duration": 5
          },
          {
            "id": "left_2",
            "content_type": "video",
            "content_path": "demo/left_2.mp4",
            "duration": 10
          }
        ]
      },
      {
        "id": "right",
        "position": {
          "x": 640,
          "y": 0,
          "width": 640,
          "height": 720,
          "z_index": 1
        },
        "items": [
          {
            "id": "right_1",
            "content_type": "video",
            "content_path": "demo/right_video.mp4",
            "duration": 15
          }
        ]
      }
    ]
  }
]
```

### Exemplo 3: Múltiplas Playlists com Agendamento

```json
[
  {
    "id": "morning_playlist",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "06:00:00",
    "end_time": "12:00:00",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main",
        "position": {"x": 0, "y": 0, "width": 1920, "height": 1080, "z_index": 1},
        "items": [
          {"id": "morning_1", "content_type": "image", "content_path": "morning/slide1.jpg", "duration": 10}
        ]
      }
    ]
  },
  {
    "id": "afternoon_playlist",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "12:00:00",
    "end_time": "18:00:00",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main",
        "position": {"x": 0, "y": 0, "width": 1920, "height": 1080, "z_index": 1},
        "items": [
          {"id": "afternoon_1", "content_type": "video", "content_path": "afternoon/promo.mp4", "duration": 20}
        ]
      }
    ]
  },
  {
    "id": "evening_playlist",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "18:00:00",
    "end_time": "06:00:00",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main",
        "position": {"x": 0, "y": 0, "width": 1920, "height": 1080, "z_index": 1},
        "items": [
          {"id": "evening_1", "content_type": "image", "content_path": "evening/night.jpg", "duration": 15}
        ]
      }
    ]
  }
]
```

### Exemplo 4: Sobreposição de Camadas (Logo + Conteúdo)

```json
[
  {
    "id": "layered_content",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "background",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080,
          "z_index": 1
        },
        "items": [
          {
            "id": "bg_video",
            "content_type": "video",
            "content_path": "backgrounds/corporate.mp4",
            "duration": 30
          }
        ]
      },
      {
        "id": "logo",
        "position": {
          "x": 1620,
          "y": 50,
          "width": 250,
          "height": 100,
          "z_index": 10
        },
        "items": [
          {
            "id": "company_logo",
            "content_type": "image",
            "content_path": "assets/logo.png",
            "duration": 30
          }
        ]
      }
    ]
  }
]
```

### Exemplo 5: Comunicados Corporativos com Áudio

```json
[
  {
    "id": "corporate_announcements",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main_screen",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080,
          "z_index": 1
        },
        "items": [
          {
            "id": "comunicado_seguranca",
            "content_type": "video",
            "content_path": "comunicados/seguranca_trabalho.mp4",
            "duration": 60,
            "muted": false
          },
          {
            "id": "comunicado_rh",
            "content_type": "video",
            "content_path": "comunicados/beneficios.mp4",
            "duration": 45,
            "muted": false
          },
          {
            "id": "comunicado_diretoria",
            "content_type": "video",
            "content_path": "comunicados/mensagem_ceo.mp4",
            "duration": 90,
            "muted": false
          },
          {
            "id": "banner_intermediario",
            "content_type": "image",
            "content_path": "slides/valores_empresa.jpg",
            "duration": 15
          }
        ]
      }
    ]
  }
]
```

**Neste exemplo:**
- Todos os vídeos de comunicados têm `"muted": false` para reproduzir o áudio
- Um banner de imagem é inserido entre os comunicados (sem áudio)
- A sequência se repete automaticamente: Segurança → RH → CEO → Banner → (reinicia)

### Exemplo 6: Duração Automática de Vídeos

```json
[
  {
    "id": "videos_auto_duration",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main",
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080,
          "z_index": 1
        },
        "items": [
          {
            "id": "video1",
            "content_type": "video",
            "content_path": "videos/apresentacao.mp4",
            "duration": "auto",
            "muted": false
          },
          {
            "id": "video2",
            "content_type": "video",
            "content_path": "videos/tutorial.mp4",
            "duration": "auto",
            "muted": false
          },
          {
            "id": "video3",
            "content_type": "video",
            "content_path": "videos/testemunho.mp4",
            "duration": "auto",
            "muted": false
          }
        ]
      }
    ]
  }
]
```

**Vantagens do `duration: "auto"`:**
- ✅ Não precisa saber a duração exata de cada vídeo
- ✅ Cada vídeo toca **completamente uma vez**
- ✅ Ideal para comunicados, palestras ou vídeos narrativos
- ✅ Evita cortes acidentais ou loops desnecessários
- ✅ Facilita adição/substituição de vídeos sem reconfigurar durações

---

## Recursos Avançados

### Sequência de Reprodução

Cada seção possui sua própria **fila de reprodução independente**:

```json
{
  "sections": [
    {
      "id": "section_a",
      "items": [
        {"id": "a1", "duration": 5},
        {"id": "a2", "duration": 10}
      ]
      // Ciclo: a1 (5s) → a2 (10s) → a1 (5s) → a2 (10s) → ...
    },
    {
      "id": "section_b",
      "items": [
        {"id": "b1", "duration": 8},
        {"id": "b2", "duration": 12}
      ]
      // Ciclo: b1 (8s) → b2 (12s) → b1 (8s) → b2 (12s) → ...
    }
  ]
}
```

As seções **NÃO** estão sincronizadas entre si. Cada uma segue seu próprio ciclo.

### Pré-carregamento Automático

O sistema pré-carrega automaticamente o próximo item **5 segundos antes** da transição:

```
Item A (exibindo) ────────────────> Item B (próximo)
                  ↑
                  5s antes: Item B começa a ser pré-carregado
```

Isso garante transições suaves sem travamentos.

### Cache de Mídia

A aplicação utiliza:
- **IndexedDB** para armazenar metadados
- **Cache API** do navegador para armazenar arquivos de mídia
- **Retry automático** (3 tentativas com delay de 2s) em caso de falha de carregamento

### Escalonamento Automático

O layout é escalonado automaticamente para se adaptar ao tamanho da janela:

```
Resolução definida: 1920x1080
Tela atual: 1366x768
↓
Sistema calcula escala e ajusta posições/tamanhos proporcionalmente
```

Isso permite que a mesma playlist funcione em diferentes resoluções de tela.

---

## Validações e Restrições

### Regras de Validação

| Campo | Regra | Exemplo Válido | Exemplo Inválido |
|-------|-------|----------------|------------------|
| `id` | Deve ser único no seu escopo | `"playlist_1"` | IDs duplicados |
| `start_date` / `end_date` | Formato `YYYY-MM-DD` | `"2025-11-29"` | `"29/11/2025"` |
| `start_time` / `end_time` | Formato `HH:MM:SS` | `"14:30:00"` | `"2:30 PM"` |
| `width` / `height` | Número inteiro > 0 | `1920` | `0`, `-100` |
| `duration` | Número > 0 | `10`, `5.5` | `0`, `-5` |
| `x` / `y` | Número >= 0 | `0`, `100` | `-10` |
| `content_type` | String (case-sensitive) | `"image"`, `"video"` | `"Image"`, `"VIDEO"` |
| `content_path` | String não vazia | `"demo/file.mp4"` | `""` |
| `z_index` | Número inteiro | `1`, `10` | `1.5` |

### Erros Comuns

#### ❌ IDs duplicados
```json
{
  "sections": [
    {"id": "main", ...},
    {"id": "main", ...}  // ERRO: ID duplicado
  ]
}
```

#### ❌ Formato de data incorreto
```json
{
  "start_date": "01/01/2025"  // ERRO: Use "2025-01-01"
}
```

#### ❌ Duração zero ou negativa
```json
{
  "items": [
    {"duration": 0}  // ERRO: Deve ser > 0
  ]
}
```

#### ❌ Content_type com capitalização incorreta
```json
{
  "content_type": "Video"  // ERRO: Use "video" (minúsculo)
}
```

---

## Fluxo de Processamento

### Diagrama de Fluxo

```
playlist_data.json
    ↓
CMS Adapter (NetworkFile/GarlicHub/Screenlite)
    ↓
useCMSAdapter() - obtém dados do adapter
    ↓
useCachedData() - gerencia cache de mídia
    ↓
usePlaylist() + useCurrentTimestamp()
    ↓
getActivePlaylist() - seleciona playlist ativa
    ↓
Player Component
    ↓
useScaleLayout() - calcula escala
    ↓
PlaylistRenderer - renderiza sections
    ↓
SectionContainer - posiciona sections
    ↓
useMediaSequence() - determina item atual
    ↓
MediaItemRenderer - renderiza imagem/vídeo
```

### Etapas Detalhadas

#### 1. Carregamento
- O adapter (ex: `NetworkFileAdapter`) faz polling periódico (padrão: 10s)
- JSON é baixado e parseado

#### 2. Seleção de Playlist Ativa
- Função `getActivePlaylist()` verifica:
  - Data atual está entre `start_date` e `end_date`?
  - Hora atual está entre `start_time` e `end_time`?
- Primeira playlist que atende aos critérios é selecionada

#### 3. Conversão de Items
- Cada `Item` é convertido para `MediaItem`:
  - `content_path` → `src` (URL resolvida)
  - `content_type` → `type`
  - `duration` (segundos) → `duration` (milissegundos)

#### 4. Cálculo de Sequência
- `calculateMediaSequenceState()` determina:
  - Qual item está sendo exibido agora (`currentIndex`)
  - Qual item deve ser pré-carregado (`preloadIndex`)
- Baseado no tempo decorrido desde o início do ciclo

#### 5. Renderização
- `SectionContainer` aplica transformações CSS para posicionar
- `MediaItemRenderer` renderiza `<img>` ou `<video>` com transições suaves

---

## Configurações Globais

### Acessando Configurações

Pressione **Ctrl+S** para abrir o overlay de configuração.

### Campos de Configuração

```typescript
export interface ConfigData {
    cmsAdapter: string
    cmsAdapterUrl: string
    timezone: string
    playbackTrackerEnabled: boolean
}
```

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `cmsAdapter` | string | `'NetworkFile'` | Tipo de adapter: `'NetworkFile'`, `'Screenlite'`, ou `'GarlicHub'` |
| `cmsAdapterUrl` | string | `''` | URL do arquivo JSON ou servidor CMS |
| `timezone` | string | Timezone local | Timezone para cálculo de horários (ex: `'America/Sao_Paulo'`) |
| `playbackTrackerEnabled` | boolean | `false` | Habilita rastreamento de reprodução |

### Exemplo de Configuração

Para usar um arquivo JSON local:
```
CMS Adapter: NetworkFile
CMS Adapter URL: /demo/playlist_data.json
Timezone: America/Sao_Paulo
Playback Tracker: false
```

Para usar um servidor remoto:
```
CMS Adapter: NetworkFile
CMS Adapter URL: https://example.com/api/playlists.json
Timezone: America/Sao_Paulo
Playback Tracker: false
```

### Armazenamento

As configurações são salvas em:
- **localStorage** com chave `cached_playlists`
- Persistem entre sessões do navegador

---

## Adapters CMS Suportados

### 1. NetworkFileAdapter (Padrão)

**Descrição:** Carrega JSON diretamente de uma URL.

**Configuração:**
```
CMS Adapter: NetworkFile
CMS Adapter URL: /demo/playlist_data.json
```

**Características:**
- Polling periódico (padrão: 10 segundos)
- Suporta URLs locais e remotas
- Headers `Cache-Control` para evitar cache
- Simples e não requer servidor especial

**Exemplo de URL:**
- Local: `/demo/playlist_data.json`
- Remoto: `https://cdn.example.com/playlists/main.json`

### 2. GarlicHubAdapter

**Descrição:** Converte SMIL XML (formato Garlic Hub) para JSON nativo.

**Configuração:**
```
CMS Adapter: GarlicHub
CMS Adapter URL: https://garlic-hub-server.com
```

**Características:**
- Busca arquivo SMIL do endpoint `/smil-index`
- Converte XML para formato JSON automaticamente
- Suporta ETag e Last-Modified para otimização
- Compatível com [Garlic-Hub CMS](https://github.com/sagiadinos/garlic-hub)

**Mapeamento SMIL → JSON:**
```xml
<root-layout width="1920" height="1080" />
  → playlist.width, playlist.height

<region regionName="main" top="0" left="0" width="1920" height="1080" z-index="1" />
  → section.position

<img src="image.jpg" dur="10s" region="main" />
  → item (content_type: "image", content_path: "image.jpg", duration: 10)
```

### 3. ScreenliteAdapter

**Descrição:** Conecta-se via WebSocket ao CMS Screenlite.

**Configuração:**
```
CMS Adapter: Screenlite
CMS Adapter URL: https://screenlite-server.com
```

**Características:**
- Usa Socket.IO para comunicação em tempo real
- Requer token de autenticação
- Suporta reconexão automática
- Push de atualizações instantâneas
- Compatível com [Screenlite CMS](https://github.com/screenlite/screenlite)

**Vantagens:**
- Atualizações em tempo real (sem polling)
- Menor latência para mudanças
- Comunicação bidirecional

---

## Constantes Importantes

| Constante | Valor | Descrição |
|-----------|-------|-----------|
| `LOCAL_STORAGE_KEY` | `'cached_playlists'` | Chave de armazenamento de configurações |
| `MAX_RETRY_ATTEMPTS` | `3` | Número máximo de tentativas de carregamento |
| `RETRY_DELAY_MS` | `2000` | Delay entre tentativas de retry (ms) |
| `PRELOAD_TIME` | `5000` | Tempo de antecedência para pré-carregamento (ms) |
| `DEFAULT_POLLING_INTERVAL` | `10000` | Intervalo de polling para adapters (ms) |

---

## Tipos TypeScript Completos

```typescript
// Playlist principal
export type Playlist = {
    id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    width: number
    height: number
    sections: Section[]
}

// Seção (região da tela)
export type Section = {
    id: string
    position: Position
    items: Item[]
}

// Posicionamento de seção
type Position = {
    x: number
    y: number
    width: number
    height: number
    z_index: number
}

// Item de mídia (input JSON)
export type Item = {
    id: string
    content_type: 'image' | 'video' | string
    content_path: string
    duration: number | 'auto'
    muted?: boolean
}

// MediaItem (processado internamente)
export type MediaItem = {
    id: string
    src: string
    type: string
    duration: number
    hidden: boolean
    preload: boolean
    muted: boolean
}

// Estado da sequência
export type MediaSequenceState = {
    currentIndex: number
    preloadIndex: null | number
    totalDuration: number
}

// Configuração global
export interface ConfigData {
    cmsAdapter: string
    cmsAdapterUrl: string
    timezone: string
    playbackTrackerEnabled: boolean
}
```

---

## Dicas e Boas Práticas

### 1. Organização de Arquivos

```
public/
├── demo/
│   ├── playlist_data.json
│   ├── images/
│   │   ├── slide1.jpg
│   │   ├── slide2.jpg
│   │   └── banner.png
│   └── videos/
│       ├── promo.mp4
│       └── intro.mp4
```

### 2. Convenções de Nomenclatura

- **IDs:** Use snake_case descritivo (`"morning_playlist"`, `"main_section"`)
- **Arquivos:** Use nomes sem espaços (`banner_image.jpg`, não `banner image.jpg`)
- **Seções:** Nomeie por função (`"header"`, `"sidebar"`, `"footer"`)

### 3. Performance

- **Otimize imagens:** Use formatos modernos (WebP, AVIF)
- **Comprima vídeos:** Use H.264 com bitrate apropriado
- **Durações razoáveis:** Evite itens muito curtos (< 3s) para reduzir transições

### 4. Layouts Responsivos

Defina resoluções padrão e deixe o sistema escalonar:
```json
{
  "width": 1920,
  "height": 1080
}
```

O player ajusta automaticamente para 1366x768, 1280x720, etc.

### 5. Testes

- Teste diferentes horários ajustando `start_time` e `end_time`
- Verifique transições entre playlists
- Teste em diferentes resoluções de tela

---

## Resolução de Problemas

### Playlist não aparece

**Verificações:**
1. Data/hora atual está entre `start_date`/`end_date` e `start_time`/`end_time`?
2. JSON está válido (sem erros de sintaxe)?
3. `cmsAdapterUrl` está configurado corretamente?
4. Abra o console do navegador para ver erros

### Mídia não carrega

**Verificações:**
1. Caminho do arquivo está correto?
2. Arquivo existe na pasta `public/`?
3. Formato do arquivo é suportado?
4. Verifique erros de CORS (para URLs remotas)

### Transições travadas

**Soluções:**
- Reduza o tamanho dos arquivos de mídia
- Verifique se há erros no console
- Aumente a duração dos itens para > 5 segundos

### Vídeo sem áudio

**Explicação:**
- Vídeos são sempre reproduzidos com `muted` por design
- Isso é necessário para autoplay funcionar nos navegadores modernos

---

## Referências

- **Repositório GitHub:** https://github.com/screenlite/web-player
- **Screenlite CMS:** https://github.com/screenlite/screenlite
- **Garlic-Hub CMS:** https://github.com/sagiadinos/garlic-hub
- **SMIL Specification:** https://www.w3.org/TR/SMIL/

---

## Changelog de Formato

### v0.0.1 (Atual)
- Formato inicial
- Suporte a imagens e vídeos
- Múltiplas seções e playlists
- Agendamento por data/hora
- Três adapters CMS (NetworkFile, GarlicHub, Screenlite)

---

**Última atualização:** 2025-11-29
