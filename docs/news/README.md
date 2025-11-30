# Documentação - Feature de Exibição de Notícias

## Índice

Esta documentação completa descreve tudo que você precisa para implementar uma feature de exibição de notícias no Screenlite Player Web.

### Documentos

1. **[01-overview.md](01-overview.md)** - Visão Geral
   - Objetivo da feature
   - Conceito visual
   - Arquiteturas propostas (Abordagem 1 vs Abordagem 2)
   - Recomendações

2. **[02-data-structure.md](02-data-structure.md)** - Estrutura de Dados
   - Formato JSON completo para notícias
   - Exemplos de layouts (tela cheia, dual, grid)
   - Cálculo de proporções e posicionamento
   - Sincronização de seções
   - Tipos de dados TypeScript

3. **[03-components.md](03-components.md)** - Componentes
   - Componentes existentes que serão utilizados
   - Novos componentes necessários (se Abordagem 2)
   - Fluxo de renderização
   - Modificações necessárias no código
   - Comparação de abordagens

4. **[04-api-integration.md](04-api-integration.md)** - Integração com APIs
   - Arquitetura de integração
   - Implementação com NetworkFileAdapter
   - Criação de adapter customizado (NewsAPIAdapter)
   - Serviço de renderização de texto para imagem
   - APIs de notícias recomendadas (NewsAPI, GNews, RSS)
   - Estratégias de cache e otimização
   - Exemplo completo de integração

5. **[05-implementation-guide.md](05-implementation-guide.md)** - Guia de Implementação
   - Passo a passo completo
   - Configuração do servidor backend
   - Configuração do player
   - Customizações (cores, fontes, layouts)
   - Deploy em produção
   - Troubleshooting
   - Checklist de implementação

6. **[06-examples.md](06-examples.md)** - Exemplos Práticos
   - 7 exemplos completos com JSON:
     - Notícia única em tela cheia
     - Rotação de 5 notícias
     - Duas notícias lado a lado
     - Notícia com vídeo
     - Ticker de notícias
     - Grid de 4 notícias
     - Agendamento por horário
   - Código backend para cada exemplo
   - Testes recomendados

---

## Quick Start

### Para Implementação Rápida (Abordagem 1 - Recomendada)

1. Leia [01-overview.md](01-overview.md) para entender o conceito
2. Veja exemplos em [06-examples.md](06-examples.md)
3. Siga o guia passo a passo em [05-implementation-guide.md](05-implementation-guide.md)
4. Use a estrutura JSON de [02-data-structure.md](02-data-structure.md) como referência

**Tempo estimado:** 2-4 horas para implementação básica

### Para Implementação Avançada (Abordagem 2)

1. Leia toda a documentação na ordem
2. Entenda as modificações necessárias em [03-components.md](03-components.md)
3. Implemente os novos componentes
4. Integre com APIs seguindo [04-api-integration.md](04-api-integration.md)

**Tempo estimado:** 1-2 dias para implementação completa

---

## Resumo Executivo

### O Que É?

Uma feature que permite exibir notícias no Screenlite Player Web com:
- **Imagem principal** da notícia
- **Título/manchete** destacado
- **Rodapé** com metadados (fonte, data, categoria)

### Como Funciona?

**Abordagem 1 (Recomendada - Zero Mudanças de Código):**
- Usa sistema de seções múltiplas já existente
- Cada notícia = 3 seções (imagem + título + rodapé)
- Título e rodapé são imagens renderizadas externamente
- Funciona imediatamente sem alterar o código do player

**Abordagem 2 (Avançada):**
- Cria novo tipo de item `content_type: 'news'`
- Renderiza texto nativamente com React/CSS
- Requer desenvolvimento de novos componentes
- Maior flexibilidade para textos dinâmicos

### Componentes Principais

1. **Backend (Node.js + Express)**
   - Consome API de notícias (NewsAPI, RSS, etc.)
   - Renderiza texto como imagem (usando Canvas)
   - Transforma notícias em formato Playlist JSON
   - Serve JSON via HTTP endpoint

2. **Player (Screenlite Web)**
   - Usa `NetworkFileAdapter` para buscar playlist
   - Renderiza notícias usando componentes existentes
   - Atualiza automaticamente via polling

### Fluxo de Dados

```
API de Notícias
    ↓
Backend (transformação + renderização)
    ↓
JSON Playlist
    ↓
NetworkFileAdapter (polling)
    ↓
Screenlite Player Web
    ↓
Exibição na tela
```

---

## Requisitos Técnicos

### Backend
- Node.js 18+
- Express.js
- node-canvas (para renderização de texto)
- node-fetch (para consumir APIs)

### Player
- Screenlite Player Web (sem modificações para Abordagem 1)
- TypeScript (para Abordagem 2)

### APIs Externas
- NewsAPI (gratuito até 100 req/dia)
- GNews, Currents API, ou RSS feeds

---

## Estrutura JSON Mínima

```json
[
  {
    "id": "news_playlist",
    "start_date": "2025-11-29",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "news_image",
        "position": { "x": 0, "y": 0, "width": 1920, "height": 756, "z_index": 1 },
        "items": [
          {
            "id": "news_1_img",
            "content_type": "image",
            "content_path": "https://example.com/image.jpg",
            "duration": 10
          }
        ]
      },
      {
        "id": "news_title",
        "position": { "x": 0, "y": 756, "width": 1920, "height": 216, "z_index": 2 },
        "items": [
          {
            "id": "news_1_title",
            "content_type": "image",
            "content_path": "data:image/png;base64,...",
            "duration": 10
          }
        ]
      },
      {
        "id": "news_footer",
        "position": { "x": 0, "y": 972, "width": 1920, "height": 108, "z_index": 3 },
        "items": [
          {
            "id": "news_1_footer",
            "content_type": "image",
            "content_path": "data:image/png;base64,...",
            "duration": 10
          }
        ]
      }
    ]
  }
]
```

---

## Arquivos de Referência do Projeto

### Types
- [src/types.ts](../../src/types.ts) - Definições de `Playlist`, `Section`, `Item`

### Componentes
- [src/SectionContainer.tsx](../../src/SectionContainer.tsx) - Renderiza seções
- [src/MediaItemRenderer.tsx](../../src/MediaItemRenderer.tsx) - Renderiza items

### Hooks
- [src/hooks/useSectionMediaItems.ts](../../src/hooks/useSectionMediaItems.ts) - Processa items
- [src/hooks/useMediaSequence.ts](../../src/hooks/useMediaSequence.ts) - Calcula sequência

### Adapters
- [src/adapters/NetworkFileAdapter.ts](../../src/adapters/NetworkFileAdapter.ts) - Adapter HTTP

---

## Perguntas Frequentes

### 1. Preciso modificar o código do Screenlite Player?

**Não** (se usar Abordagem 1). A arquitetura existente de seções já suporta tudo que você precisa.

### 2. Como gero imagens para título e rodapé?

Use bibliotecas como `node-canvas` no backend ou serviços como Cloudinary, Bannerbear.

### 3. Posso misturar notícias com outros conteúdos?

**Sim**! Crie múltiplas playlists com diferentes horários ou adicione seções extras.

### 4. Como atualizo notícias em tempo real?

Use `NetworkFileAdapter` com polling curto (30-60 segundos) ou implemente WebSocket.

### 5. Funciona com vídeos de notícias?

**Sim**! Use `content_type: "video"` e `duration: "auto"` para detectar duração automaticamente.

### 6. Como faço duas notícias lado a lado?

Crie 6 seções (3 para esquerda, 3 para direita) com `width: 960` cada. Veja exemplo em [06-examples.md](06-examples.md#exemplo-3-duas-notícias-lado-a-lado).

---

## Próximos Passos

Após implementação básica:

1. **Analytics**: Rastrear quais notícias foram exibidas e por quanto tempo
2. **Filtros**: Categorias, palavras-chave, regiões
3. **Priorização**: Notícias "breaking" com destaque especial
4. **Múltiplas fontes**: Agregar NewsAPI + RSS + APIs locais
5. **Dashboard**: Interface administrativa para gerenciar notícias
6. **Machine Learning**: Recomendação de notícias baseada em audiência

---

## Suporte

Para dúvidas ou problemas:

1. Revise a seção de [Troubleshooting](05-implementation-guide.md#troubleshooting)
2. Consulte os [exemplos práticos](06-examples.md)
3. Verifique a documentação oficial do Screenlite Player Web

---

## Changelog

- **2025-11-29**: Documentação inicial criada
  - Visão geral e arquitetura
  - Estrutura de dados completa
  - Guia de implementação passo a passo
  - 7 exemplos práticos
  - Integração com APIs

---

## Licença

Esta documentação segue a mesma licença do projeto Screenlite Player Web.
