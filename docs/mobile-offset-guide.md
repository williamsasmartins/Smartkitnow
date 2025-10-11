# Guia de Offset abaixo do Header (Mobile)

## 1) Contexto e objetivo
- Problema: o botão "Back" e o título das páginas podiam ficar parcialmente atrás do Header fixo no mobile.
- Objetivo: garantir que o conteúdo principal das páginas (incluindo o "Back") apareça totalmente abaixo do Header e do menu de categorias.

## 2) Ajustes efetuados nos botões "Back"
- Padronização de padding vertical do botão "Back" para evitar corte no mobile:
  - Classe final: `px-3 py-2 md:py-2.5`
- Arquivos atualizados:
  - `src/pages/CategoryIndex.tsx`
  - `src/pages/CategorySubcategory.tsx`
  - `src/pages/FinancialCalculators.tsx`
- Observação: Em calculadoras individuais que usam `variant="ghost"` e `size="sm"`, aplique padding semelhante se observar corte no mobile.

## 3) Offsets abaixo do Header (evolução e estado atual)
- Primeira tentativa (descontinuada):
  - Criada a utilidade CSS `.skn-offset-header` em `src/index.css`, e aplicada dentro do layout:
    - Em `src/components/layouts/PageWithRails.tsx` foi adicionada `.skn-offset-header` no `titleBlock` e no `main`.
  - Resultado: em alguns dispositivos, isso deslocou indevidamente o conteúdo (pareceu "subir a página"), então removemos esse offset do layout.

- Estado final e estável (atual):
  - Removemos `.skn-offset-header` do layout (`PageWithRails.tsx`).
  - Aplicamos o espaçamento abaixo do Header diretamente na página Financeira (apenas nela):
    - Em `src/pages/FinancialCalculators.tsx`, o container principal usa:
      - Mobile: `mt-[156px]`
      - sm+: `md:mt-[176px]`
  - Isso garante que "Back" e H1 não fiquem atrás do Header no mobile sem afetar outras páginas.

## 4) Como aplicar o offset em outras páginas (se necessário)
- Quando uma página tem Header fixo e o conteúdo inicial fica atrás do Header no mobile:
  - Adicione margem superior no `main` ou wrapper logo abaixo do `<Header />`:
    - Exemplo recomendado: `mt-[156px]` (mobile) e `md:mt-[176px]` (sm+).
- Quando usar `PageWithRails`:
  - O layout atual não define offset; cada página controla seu espaço abaixo do Header.
- Ajuste fino:
  - Se no seu dispositivo o Header for visualmente maior, aumente em passos de 8–16px (ex.: `mt-[168px]` → `mt-[184px]`).

## 5) Validação visual
- Servidor local:
  - `http://localhost:<porta>/financial` (ex.: `8080` ou outra porta de desenvolvimento)
- O que checar:
  - O botão "Back" deve aparecer completamente.
  - O H1 da página não deve ficar atrás do Header.
  - Ao rolar, nada deve "pular" ou "grudar" inesperadamente no topo.

## 6) Impactos colaterais e recomendações
- Remover o offset do layout elimina o risco de deslocar conteúdos em páginas que não precisam dele.
- Cada página que usa `<Header />` controla seu próprio offset abaixo do Header.
- Mantenha consistência visual com os botões "Back" usando padding `px-3 py-2 md:py-2.5`.

## 7) Sitemaps e Robots (confirmação)
- Já existem arquivos no projeto:
  - Sitemap: `public/sitemap.xml`
  - Robots: `public/robots.txt`
- Como estão em `public`, serão servidos em `/sitemap.xml` e `/robots.txt` no site.

## 8) Resumo dos arquivos-chave tocados
- Layout:
  - `src/components/layouts/PageWithRails.tsx`
- Página Financeira:
  - `src/pages/FinancialCalculators.tsx`
- CSS utilitários:
  - `src/index.css`
- Botões "Back" padronizados:
  - `src/pages/CategoryIndex.tsx`
  - `src/pages/CategorySubcategory.tsx`
  - `src/pages/FinancialCalculators.tsx`

## 9) Checklist rápido para novas páginas
- [ ] O header é fixo? Se sim, verifique o primeiro bloco de conteúdo.
- [ ] O botão "Back" aparece completamente no mobile?
- [ ] Se houver sobreposição, aplique `mt-[156px]` (mobile) e `md:mt-[176px]` (sm+).
- [ ] Ajuste fino em passos de 8–16px conforme necessário.