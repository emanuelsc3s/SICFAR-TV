# Feature de Exibição de Notícias - Visão Geral

## Objetivo

Implementar uma feature completa de exibição de notícias no Screenlite Player Web, permitindo mostrar:
- Notícia principal (imagem destacada)
- Título/manchete da notícia
- Rodapé com informações adicionais (fonte, data, categoria)

## Conceito Visual

```
┌─────────────────────────────────────────────────┐
│                                                 │
│        IMAGEM DA NOTÍCIA PRINCIPAL              │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  TÍTULO DA NOTÍCIA EM DESTAQUE                  │
│                                                 │
├─────────────────────────────────────────────────┤
│ Categoria | Fonte | 29/11/2025 14:30           │
└─────────────────────────────────────────────────┘
```

## Arquitetura Proposta

### Abordagem 1: Usando Sistema Atual de Seções (Recomendada)

Aproveitar a arquitetura existente de `Section` + `Position` para criar um layout composto:

- **Seção Superior (70%)**: Imagem da notícia
- **Seção Título (20%)**: Título/manchete como imagem renderizada ou vídeo
- **Seção Rodapé (10%)**: Informações secundárias como imagem/vídeo

**Vantagens:**
- Não requer mudanças na arquitetura existente
- Usa sistema de posicionamento robusto e testado
- Permite layouts flexíveis (notícias lado a lado, grid, etc.)
- Suporta múltiplas notícias simultâneas

**Desvantagens:**
- Requer geração de imagens para texto (título/rodapé)
- Mais complexo no servidor/API que prepara os dados

### Abordagem 2: Novo Componente NewsRenderer (Alternativa)

Criar um componente React especializado que renderiza HTML/CSS diretamente:

- Novo tipo de item: `content_type: 'news'`
- Componente `NewsItemRenderer` que renderiza estrutura HTML
- Dados da notícia em formato JSON estruturado

**Vantagens:**
- Renderização nativa de texto (sem geração de imagens)
- Mais fácil para APIs fornecerem dados estruturados
- Melhor para textos dinâmicos e longos

**Desvantagens:**
- Requer modificação na arquitetura atual
- Novo componente a ser desenvolvido e testado
- Maior complexidade no `MediaItemRenderer`

## Recomendação

**Usar Abordagem 1** por:
1. Manter compatibilidade total com arquitetura existente
2. Aproveitar sistema de cache já implementado
3. Funcionar imediatamente sem mudanças no código
4. Permitir maior flexibilidade visual

A geração de imagens para texto pode ser feita:
- No servidor/API (ideal)
- Em serviço separado (microserviço de renderização)
- Em pipeline de CI/CD
- Usando ferramentas como Canvas API, Sharp, ImageMagick, etc.

## Próximos Documentos

1. `02-data-structure.md` - Estrutura de dados JSON detalhada
2. `03-components.md` - Componentes necessários (se Abordagem 2)
3. `04-api-integration.md` - Integração com APIs de notícias
4. `05-implementation-guide.md` - Guia passo a passo de implementação
5. `06-examples.md` - Exemplos práticos e casos de uso
