# CalculatorUnifiedLayout

Layout padrão único para todas as calculadoras do site.

## Estrutura de arquivos
- `CalculatorUnifiedLayout.tsx`: componente de layout principal.
- (opcional) componentes auxiliares de UI são importados de `@/components`.

## Diretrizes de uso
- Importe: `import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout"`.
- Propriedades principais:
  - `title: string` — título da página.
  - `editorial: ReactNode` — conteúdo editorial (artigo, fórmula, exemplos, FAQ etc.).
  - `widget: ReactNode` — o formulário/calculadora (renderizado sticky à direita em telas largas).
  - `railRight?: ReactNode | null` — conteúdo opcional para a barra direita (anúncios, links, etc.).
  - `showTitle?: boolean` — exibe ou oculta o `h1`.
  - `stickyTopPx?: number` — offset do sticky (padrão `120`).
  - `maxWidth?: number` — largura máxima do grid (padrão `1200`).
  - `gap?: number` — espaçamento entre colunas/linhas em px (padrão `32`).
  - `jsonLd?: object | object[]` — injeta JSON-LD no `<script type="application/ld+json">`.
  - `showTopBanner?: boolean` e `topBannerHeight?: number` — controla o slot/placeholder de banner superior.

## Padrões visuais
- Tipografia: `h1` com fonte `bold` e cor `#5c82ee`.
- Grid: 12 colunas; em `lg`, editorial ocupa 7 colunas e o widget 5.
- Sticky: widget com fallback seguro para navegadores/containers com `overflow`.
- Boxes: o layout sempre renderiza `LegalDisclaimer`, `ShareThisPageBox` e `SuggestionBox` após o conteúdo principal.

## Restrições de customização
- Não alterar nome do arquivo nem assinatura pública do componente sem alinhar toda a base.
- Evite inserir `position: sticky`/`fixed` dentro do `widget`; o layout já gerencia sticky com fallback.
- Mantenha `editorial` sem duplicar disclaimer/share/suggestion — esses boxes são adicionados pelo layout.
- `railRight` deve ser `null` quando não houver conteúdo; evite usar grid interno diferente do padrão.

## Exemplo mínimo
```tsx
<CalculatorUnifiedLayout
  title="Example Calculator"
  editorial={<Article />}
  widget={<FormWidget />}
  railRight={null}
  stickyTopPx={120}
  maxWidth={1200}
  gap={32}
/>
```