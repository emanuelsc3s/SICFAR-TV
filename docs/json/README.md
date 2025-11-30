# Documentação do Screenlite Player Web

Bem-vindo à documentação do **Screenlite Player Web**, um reprodutor de sinalização digital de código aberto baseado na web.

---

## 📚 Índice de Documentação

### 1. [**Referência Completa do JSON**](playlist-json-reference.md)
Documentação técnica completa de todos os campos, propriedades e comandos suportados no arquivo `playlist_data.json`.

**Inclui:**
- Estrutura e tipos de dados
- Propriedades de Playlist, Sections, Position e Items
- Tipos de conteúdo suportados (imagens e vídeos)
- Exemplos práticos completos
- Recursos avançados (sequências, cache, escalonamento)
- Validações e restrições
- Fluxo de processamento interno
- Adapters CMS (NetworkFile, GarlicHub, Screenlite)
- Tipos TypeScript completos

**Quando usar:** Para referência técnica completa e implementação de playlists.

---

### 2. [**Guia de Suporte a Áudio**](audio-support-guide.md)
Guia específico para implementação de vídeos com áudio, ideal para comunicados corporativos.

**Inclui:**
- Como usar a propriedade `muted`
- Exemplos de casos de uso corporativos
- Configuração para TV corporativa, onboarding, lobby, etc.
- Especificações técnicas de formatos de vídeo
- Considerações sobre autoplay de navegadores
- Troubleshooting completo
- FAQ sobre áudio

**Quando usar:** Para implementar comunicados, treinamentos ou qualquer conteúdo com narração/áudio.

---

## 🚀 Início Rápido

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/screenlite/web-player.git
cd web-player

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

### Primeira Playlist

Crie ou edite o arquivo `public/demo/playlist_data.json`:

```json
[
  {
    "id": "minha_primeira_playlist",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "tela_principal",
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
            "content_path": "demo/imagem1.jpg",
            "duration": 10
          },
          {
            "id": "video1",
            "content_type": "video",
            "content_path": "demo/video1.mp4",
            "duration": 20
          }
        ]
      }
    ]
  }
]
```

Acesse `http://localhost:5173` no navegador e sua playlist começará a tocar!

---

## 📖 Guias por Caso de Uso

### Digital Signage Básico (Sem Áudio)
- **Use:** Configuração padrão (vídeos sem `muted: false`)
- **Ideal para:** Lojas, restaurantes, lobbies sem som ambiente
- **Documentação:** [playlist-json-reference.md](playlist-json-reference.md)

### Comunicados Corporativos (Com Áudio)
- **Use:** Propriedade `muted: false` nos vídeos
- **Ideal para:** TV corporativa, onboarding, treinamentos
- **Documentação:** [audio-support-guide.md](audio-support-guide.md)

### Tela Dividida (Split Screen)
- **Use:** Múltiplas seções com diferentes posições
- **Ideal para:** Conteúdo principal + sidebar informativo
- **Exemplo:** Ver seção "Exemplo 2" em [playlist-json-reference.md](playlist-json-reference.md#exemplo-2-tela-dividida-esquerda--direita)

### Grade de Vídeos (Video Wall)
- **Use:** Múltiplas seções posicionadas em grade
- **Ideal para:** Exibição simultânea de múltiplos feeds
- **Exemplo:** Ver seção "Grade 2x2" em [playlist-json-reference.md](playlist-json-reference.md#grade-2x2)

---

## 🎯 Recursos Principais

### ✅ Múltiplos Formatos
- **Imagens:** JPEG, PNG, GIF, WebP, AVIF
- **Vídeos:** MP4 (H.264), WebM

### ✅ Agendamento Avançado
- Playlists por data e hora
- Suporte a agendamento "overnight"
- Múltiplas playlists alternadas

### ✅ Layout Flexível
- Seções posicionáveis livremente
- Suporte a sobreposição (z-index)
- Escalonamento automático para diferentes resoluções

### ✅ Suporte a Áudio (NOVO!)
- Vídeos podem tocar com áudio
- Controle item por item via propriedade `muted`
- Ideal para comunicados e treinamentos

### ✅ Cache Inteligente
- Pré-carregamento automático (5s antes)
- Cache local via IndexedDB/Cache API
- Retry automático em caso de falha

### ✅ Adapters CMS
- **NetworkFile:** JSON direto de URL
- **GarlicHub:** Integração com Garlic-Hub CMS
- **Screenlite:** WebSocket em tempo real

---

## 🛠️ Configuração Avançada

### Configurações Globais

Pressione **Ctrl+S** durante a execução para acessar o overlay de configuração:

- **CMS Adapter:** Tipo de fonte de dados
- **CMS Adapter URL:** URL do JSON ou servidor CMS
- **Timezone:** Timezone para cálculo de horários
- **Playback Tracker:** Rastreamento de reprodução

### Variáveis de Ambiente

Nenhuma configuração via variáveis de ambiente necessária. Tudo é configurado via interface ou JSON.

---

## 📋 Estrutura de Arquivos

```
web-player/
├── public/
│   └── demo/
│       ├── playlist_data.json    # Arquivo de configuração de playlists
│       ├── *.jpg, *.png, *.avif  # Imagens
│       └── *.mp4                 # Vídeos
├── src/
│   ├── types.ts                  # Definições TypeScript
│   ├── Player.tsx                # Componente principal
│   ├── MediaItemRenderer.tsx     # Renderizador de mídia
│   └── hooks/                    # Hooks React customizados
├── docs/
│   ├── README.md                 # Este arquivo
│   ├── playlist-json-reference.md # Referência completa
│   └── audio-support-guide.md    # Guia de áudio
└── package.json
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor local
npm run dev:server       # Inicia servidor acessível na rede

# Produção
npm run build            # Compila para produção
npm run preview          # Preview da build de produção

# Qualidade de código
npm run lint             # Verifica erros de lint
```

---

## 🌐 Compatibilidade de Navegadores

| Navegador | Versão Mínima | Suporte a Áudio |
|-----------|---------------|-----------------|
| Chrome    | 90+           | ✅ Sim          |
| Edge      | 90+           | ✅ Sim          |
| Firefox   | 88+           | ✅ Sim          |
| Safari    | 14+           | ⚠️ Limitado*    |

\* Safari possui políticas de autoplay mais restritivas para áudio.

**Recomendado:** Google Chrome para melhor compatibilidade e performance.

---

## 📞 Suporte e Contribuição

### Reportar Problemas
- **GitHub Issues:** https://github.com/screenlite/web-player/issues

### Contribuir
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Comunidade
- **GitHub:** https://github.com/screenlite/web-player
- **Screenlite CMS:** https://github.com/screenlite/screenlite

---

## 📄 Licença

Este projeto é open-source. Consulte o arquivo LICENSE no repositório para mais detalhes.

---

## 🔄 Changelog

### v0.0.2 (2025-11-29)
- ✅ **NOVO:** Suporte a áudio em vídeos via propriedade `muted`
- ✅ Documentação completa em português
- ✅ Guia específico para comunicados corporativos

### v0.0.1 (Inicial)
- ✅ Reprodução de playlists com imagens e vídeos
- ✅ Múltiplas seções e layouts
- ✅ Agendamento por data/hora
- ✅ Três adapters CMS
- ✅ Cache inteligente

---

## 💡 Dicas Finais

1. **Comece simples:** Use uma playlist básica em tela cheia antes de layouts complexos
2. **Teste localmente:** Use `npm run dev` para testar antes de implantar
3. **Otimize mídia:** Comprima imagens e vídeos para melhor performance
4. **Use Chrome:** Para melhor compatibilidade, especialmente com áudio
5. **Leia a documentação:** [playlist-json-reference.md](playlist-json-reference.md) tem exemplos detalhados

---

**Última atualização:** 2025-11-29
