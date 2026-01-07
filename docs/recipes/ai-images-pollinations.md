# Imagens de Receitas via Pollinations.ai

Este projeto gera imagens realistas de pratos diretamente no frontend usando o endpoint de imagens do Pollinations.ai, com cache em `localStorage` para evitar tentativas repetidas quando um prompt falha.

## Onde está implementado

- Página: [RecipeDetailPage.tsx](file:///c:/Users/Williams%20Martins/OneDrive/Documentos/WBSmartKitNow/smartkit-onepage-wonder/src/pages/RecipeDetailPage.tsx)
- Escopo atual: receita `italian/tomato-and-basil-bruschetta` (hero) + cards de “Related recipes”.

## Como funciona

- O prompt é montado a partir do nome do prato e da culinária (ex.: “Tomato and Basil Bruschetta”, “Italian”).
- A URL gerada é determinística, usando `seed` derivado de um identificador estável (`cacheId`).
- A imagem “hero” usa fallback imediato (Unsplash) e faz upgrade para a imagem gerada assim que ela carrega com sucesso.
- Os cards relacionados usam `loading="lazy"` para não impactar o carregamento inicial.

## Cache e retry

O cache é persistido em `localStorage`:

- Chave: `skn:pollinations:image-cache:v1`
- Valor: mapa `{ [cacheId]: { url, status, updatedAt } }`

Regras:

- `status="ok"` expira em 30 dias.
- `status="error"` expira em 6 horas (evita “loop” de falhas).

## Tratamento de erros

- Hero: mantém a imagem fallback e registra `status="error"` no cache.
- Cards: substitui por um placeholder visual (sem ícone quebrado) e registra `status="error"`.

## Como estender para outras receitas

1. Identifique a receita na página (como o `isBruschetta`).
2. Defina um `cacheId` estável por posição/variante (ex.: `recipes:${c.key}:${r.slug}:hero`).
3. Use `AiDishImage` para imagens inline e/ou aplique o mesmo padrão “fallback + upgrade” usado no hero.

