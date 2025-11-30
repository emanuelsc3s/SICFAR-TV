# Guia de Suporte a Áudio para Comunicados Corporativos

## Resumo

A partir de agora, o **Screenlite Player Web** suporta reprodução de áudio em vídeos! Essa funcionalidade é ideal para comunicados corporativos, mensagens da diretoria, vídeos de treinamento, e qualquer conteúdo que precise de narração ou música.

---

## Como Usar

### 1. Configuração Básica

Para reproduzir um vídeo **COM áudio**, adicione a propriedade `"muted": false` ao item:

```json
{
  "id": "comunicado_ceo",
  "content_type": "video",
  "content_path": "comunicados/mensagem_ceo.mp4",
  "duration": 60,
  "muted": false
}
```

### 2. Duração Automática (NOVO!)

Se você não quiser especificar a duração manualmente, use `"duration": "auto"` para que o vídeo use sua duração real:

```json
{
  "id": "comunicado_ceo",
  "content_type": "video",
  "content_path": "comunicados/mensagem_ceo.mp4",
  "duration": "auto",
  "muted": false
}
```

O vídeo tocará **completamente uma vez** usando sua duração real, sem precisar calcular os segundos manualmente.

### 3. Comportamento Padrão (SEM áudio)

Se você **NÃO** especificar a propriedade `muted`, o vídeo tocará sem áudio (comportamento padrão):

```json
{
  "id": "video_background",
  "content_type": "video",
  "content_path": "backgrounds/motion.mp4",
  "duration": 30
}
// Equivalente a "muted": true
```

---

## Exemplos de Uso

### Exemplo 1: Comunicados Corporativos em Loop

```json
[
  {
    "id": "comunicados_rh",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "08:00:00",
    "end_time": "18:00:00",
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
            "id": "comunicado_1",
            "content_type": "video",
            "content_path": "rh/seguranca_trabalho.mp4",
            "duration": 45,
            "muted": false
          },
          {
            "id": "comunicado_2",
            "content_type": "video",
            "content_path": "rh/novos_beneficios.mp4",
            "duration": 60,
            "muted": false
          },
          {
            "id": "comunicado_3",
            "content_type": "video",
            "content_path": "rh/campanha_saude.mp4",
            "duration": 30,
            "muted": false
          }
        ]
      }
    ]
  }
]
```

**Resultado:** Os três vídeos serão reproduzidos em sequência com áudio, e ao terminar, o ciclo recomeça automaticamente.

---

### Exemplo 1B: Comunicados com Duração Automática

```json
[
  {
    "id": "comunicados_rh_auto",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "08:00:00",
    "end_time": "18:00:00",
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
            "id": "comunicado_1",
            "content_type": "video",
            "content_path": "rh/seguranca_trabalho.mp4",
            "duration": "auto",
            "muted": false
          },
          {
            "id": "comunicado_2",
            "content_type": "video",
            "content_path": "rh/novos_beneficios.mp4",
            "duration": "auto",
            "muted": false
          },
          {
            "id": "comunicado_3",
            "content_type": "video",
            "content_path": "rh/campanha_saude.mp4",
            "duration": "auto",
            "muted": false
          }
        ]
      }
    ]
  }
]
```

**Vantagem:** Não precisa saber a duração exata de cada vídeo! Cada um tocará completamente uma vez usando sua duração real.

---

### Exemplo 2: Misturando Vídeos com e sem Áudio

```json
{
  "sections": [
    {
      "id": "main",
      "position": {"x": 0, "y": 0, "width": 1920, "height": 1080, "z_index": 1},
      "items": [
        {
          "id": "comunicado_com_audio",
          "content_type": "video",
          "content_path": "comunicados/diretor_geral.mp4",
          "duration": 90,
          "muted": false
        },
        {
          "id": "video_decorativo",
          "content_type": "video",
          "content_path": "backgrounds/empresa.mp4",
          "duration": 20,
          "muted": true
        },
        {
          "id": "banner_estatico",
          "content_type": "image",
          "content_path": "slides/valores.jpg",
          "duration": 15
        }
      ]
    }
  ]
}
```

**Resultado:**
1. Vídeo do diretor (COM áudio) - 90s
2. Vídeo decorativo (SEM áudio) - 20s
3. Imagem estática - 15s
4. (Recomeça)

---

### Exemplo 3: Tela Dividida - Vídeo com Áudio + Conteúdo Silencioso

```json
{
  "width": 1920,
  "height": 1080,
  "sections": [
    {
      "id": "video_principal",
      "position": {
        "x": 0,
        "y": 0,
        "width": 1280,
        "height": 1080,
        "z_index": 1
      },
      "items": [
        {
          "id": "treinamento_video",
          "content_type": "video",
          "content_path": "treinamentos/seguranca.mp4",
          "duration": 120,
          "muted": false
        }
      ]
    },
    {
      "id": "sidebar_info",
      "position": {
        "x": 1280,
        "y": 0,
        "width": 640,
        "height": 1080,
        "z_index": 1
      },
      "items": [
        {
          "id": "slides_complementares",
          "content_type": "image",
          "content_path": "slides/topicos_principais.jpg",
          "duration": 120
        }
      ]
    }
  ]
}
```

**Resultado:**
- Esquerda (2/3 da tela): Vídeo de treinamento COM áudio
- Direita (1/3 da tela): Slide informativo estático

---

## Casos de Uso Corporativos

### 1. **TV Corporativa no Refeitório**
```json
{
  "id": "tv_refeitorio",
  "start_time": "11:30:00",
  "end_time": "14:00:00",
  "sections": [{
    "items": [
      {"content_path": "avisos/cardapio_semana.mp4", "muted": false, "duration": 30},
      {"content_path": "avisos/eventos_empresa.mp4", "muted": false, "duration": 45},
      {"content_path": "noticias/setor_comercial.mp4", "muted": false, "duration": 60}
    ]
  }]
}
```

### 2. **Onboarding de Novos Colaboradores**
```json
{
  "id": "onboarding_sala",
  "sections": [{
    "items": [
      {"content_path": "onboarding/boas_vindas_ceo.mp4", "muted": false, "duration": 180},
      {"content_path": "onboarding/cultura_empresa.mp4", "muted": false, "duration": 240},
      {"content_path": "onboarding/tour_virtual.mp4", "muted": false, "duration": 300}
    ]
  }]
}
```

### 3. **Lobby/Recepção - Mensagem Institucional**
```json
{
  "id": "lobby_principal",
  "sections": [{
    "items": [
      {"content_path": "institucional/historia_empresa.mp4", "muted": false, "duration": 120},
      {"content_path": "slides/premios_conquistados.jpg", "duration": 20},
      {"content_path": "institucional/depoimentos_clientes.mp4", "muted": false, "duration": 90}
    ]
  }]
}
```

### 4. **Segurança do Trabalho - Área Industrial**
```json
{
  "id": "seguranca_fabrica",
  "sections": [{
    "items": [
      {"content_path": "seguranca/uso_epis.mp4", "muted": false, "duration": 180},
      {"content_path": "seguranca/procedimentos_emergencia.mp4", "muted": false, "duration": 240},
      {"content_path": "seguranca/relatorio_acidentes.mp4", "muted": false, "duration": 60}
    ]
  }]
}
```

---

## Especificações Técnicas

### Propriedade `muted`

| Configuração | Comportamento |
|--------------|---------------|
| `"muted": false` | Vídeo toca **COM áudio** |
| `"muted": true` | Vídeo toca **SEM áudio** |
| (não especificado) | Vídeo toca **SEM áudio** (padrão) |

### Propriedade `duration`

| Configuração | Comportamento |
|--------------|---------------|
| `"duration": 30` | Vídeo toca por 30 segundos (loop se necessário) |
| `"duration": "auto"` | Vídeo usa sua duração real (toca uma vez completo) |

### Formatos de Vídeo Recomendados

Para melhor compatibilidade com áudio:

- **Formato:** MP4 (H.264)
- **Codec de vídeo:** H.264
- **Codec de áudio:** AAC
- **Taxa de bits recomendada:**
  - Vídeo: 2-5 Mbps
  - Áudio: 128-192 kbps
- **Resolução:** 1920x1080 (Full HD) ou menor

### Exemplo de Comando FFmpeg para Conversão

```bash
ffmpeg -i entrada.mov -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k -ar 44100 \
  -movflags +faststart saida.mp4
```

---

## Considerações Importantes

### 1. **Autoplay de Áudio em Navegadores**

⚠️ **IMPORTANTE:** Navegadores modernos possuem políticas de autoplay que podem bloquear áudio automático.

- **Chrome/Edge:** Permite autoplay com áudio se o site já tiver recebido interação do usuário
- **Firefox:** Similar ao Chrome
- **Safari:** Mais restritivo; pode exigir interação manual

**Recomendação:** Para ambientes corporativos controlados (TVs, totens):
1. Configure o Chrome com a flag `--autoplay-policy=no-user-gesture-required`
2. Adicione o site à whitelist de autoplay do navegador
3. Use modo kiosk/quiosque para evitar bloqueios

### 2. **Volume do Sistema**

A aplicação não controla o volume do sistema operacional. Certifique-se de:
- Ajustar o volume do sistema operacional adequadamente
- Testar o volume antes de implantar em produção
- Considerar o ambiente (sala silenciosa vs área com ruído)

### 3. **Conflitos de Áudio em Múltiplas Seções**

⚠️ Se você tiver múltiplas seções com vídeos que possuem `"muted": false`, **TODOS** tocarão áudio simultaneamente, o que pode gerar confusão sonora.

**Exemplo de conflito:**
```json
{
  "sections": [
    {
      "id": "section_1",
      "items": [{"content_path": "video1.mp4", "muted": false}]  // Áudio 1
    },
    {
      "id": "section_2",
      "items": [{"content_path": "video2.mp4", "muted": false}]  // Áudio 2
    }
  ]
}
// Resultado: Áudio 1 + Áudio 2 tocando ao mesmo tempo ❌
```

**Solução:** Use apenas UMA seção com áudio por vez, ou garanta que apenas um vídeo com áudio esteja ativo.

### 4. **Performance**

Vídeos com áudio podem consumir mais recursos:
- Certifique-se de que o hardware suporta decodificação
- Use vídeos otimizados (não excessivamente grandes)
- Monitore o uso de CPU/memória

---

## Testando a Implementação

### Passo 1: Atualizar o JSON

Edite seu arquivo `playlist_data.json`:

```json
[
  {
    "id": "test_audio",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "start_time": "00:00:00",
    "end_time": "23:59:59",
    "width": 1920,
    "height": 1080,
    "sections": [
      {
        "id": "main",
        "position": {"x": 0, "y": 0, "width": 1920, "height": 1080, "z_index": 1},
        "items": [
          {
            "id": "test_video",
            "content_type": "video",
            "content_path": "demo/Lis.mp4",
            "duration": 20,
            "muted": false
          }
        ]
      }
    ]
  }
]
```

### Passo 2: Executar a Aplicação

```bash
npm run dev
```

### Passo 3: Verificar no Navegador

1. Abra o Chrome
2. Acesse `http://localhost:5173`
3. **Se o áudio não tocar automaticamente:**
   - Clique em qualquer lugar da página (interação do usuário)
   - Recarregue a página (F5)
   - O áudio deve começar a tocar

### Passo 4: Verificação de Console

Abra o DevTools (F12) e verifique se não há erros no console relacionados a autoplay.

---

## Troubleshooting (Resolução de Problemas)

### ❌ Problema: Áudio não toca

**Possíveis causas:**
1. Navegador bloqueou autoplay
2. Volume do sistema está mudo
3. Arquivo de vídeo não possui áudio
4. `muted` não foi definido como `false`

**Soluções:**
```bash
# 1. Verificar se vídeo tem áudio
ffprobe -i seu_video.mp4 -show_streams -select_streams a

# 2. Iniciar Chrome com autoplay habilitado
chrome --autoplay-policy=no-user-gesture-required http://localhost:5173

# 3. Verificar volume do sistema
# Linux: alsamixer
# Windows: Verificar ícone de volume
# Mac: Verificar barra de volume
```

### ❌ Problema: Áudio distorcido ou travado

**Possíveis causas:**
1. Taxa de bits muito alta
2. Hardware insuficiente
3. Múltiplos vídeos com áudio tocando simultaneamente

**Soluções:**
- Recodificar vídeo com bitrate menor
- Usar apenas uma seção com áudio
- Verificar uso de CPU/memória

### ❌ Problema: Atraso entre vídeo e áudio

**Solução:**
- Verificar sincronização A/V no arquivo original
- Recodificar vídeo com FFmpeg garantindo sincronização

---

## Migração de Configurações Antigas

Se você já possui playlists configuradas e quer manter o comportamento padrão (sem áudio), **não precisa fazer nada**. O comportamento padrão continua sendo `muted: true`.

Para adicionar áudio gradualmente:
1. Identifique os vídeos que devem ter áudio
2. Adicione `"muted": false` apenas nesses itens
3. Teste um de cada vez

---

## Perguntas Frequentes (FAQ)

### 1. **Posso controlar o volume de cada vídeo individualmente?**
Não. A aplicação usa o volume do sistema. Todos os vídeos com `muted: false` terão o mesmo volume.

### 2. **Posso ter vídeos com áudio em tela dividida?**
Tecnicamente sim, mas **não é recomendado** pois os áudios tocarão simultaneamente, causando confusão.

### 3. **O áudio funciona em todos os navegadores?**
A implementação usa o elemento `<video>` HTML5 padrão, que é suportado por todos os navegadores modernos. Porém, políticas de autoplay variam entre navegadores.

### 4. **Posso usar música de fundo contínua?**
Sim! Crie um item com um vídeo (ou apenas áudio em formato MP4) e configure `muted: false` com duração adequada.

### 5. **E se eu quiser silenciar apenas temporariamente?**
Você precisaria alterar o JSON (mudar `muted` para `true`) ou controlar o volume pelo sistema operacional.

---

## Changelog

### Versão 0.0.2 (2025-11-29)
- ✅ Adicionado suporte à propriedade `muted` em items
- ✅ Vídeos podem agora reproduzir com áudio
- ✅ Comportamento padrão mantido (muted: true) para compatibilidade

---

**Documentação completa:** [playlist-json-reference.md](playlist-json-reference.md)

**Dúvidas?** Abra uma issue no repositório GitHub.
