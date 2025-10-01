# Smart Kit Now — Site Audit (v1)

Data: (preencher a data de hoje)

## 1) Branding & Consistência Visual

- [x] **Tokens fixos** (`/src/styles/theme.css`):
  - `.skn-title` = `#5c82ee`
  - `.skn-sub`   = `#747886`
  - `.skn-back`  = `#3c83f6` (texto branco)
- [x] **Botões “Back”** padronizados:
  - Componente: `/src/components/BackButton.tsx`
  - Usa classe **`.skn-back`** (sempre azul), com **fallback** seguro
- [x] **Títulos centralizados**:
  - Home: **Index.tsx** (seção “Calculator Categories”): h2 centralizado + classe `.skn-title`
  - Hubs (ex.: `/math`): h1 centralizado + `.skn-title`
  - Detalhe de calculadora: h1 centralizado com nome da calculadora

### Ações pendentes
- [ ] Verificar se **TODOS os títulos principais** usam `.skn-title` (busca por `className="text-4xl` e confere se não está faltando a classe)
- [ ] Em páginas novas, **sempre** usar:  
  `className="text-4xl font-bold text-center skn-title"`

---

## 2) Navegação & UX

- [x] **Back à esquerda** nas listagens (ex.: Math, CategoryIndex)
- [x] Nos **detalhes das calculadoras**, o “Back” aparece **acima** do título e é **azul**
- [x] **Página de calculadora** usa `CalculatorLayout` limpo (sem ads), focado no conteúdo

### Ações pendentes
- [ ] Confirmar que **todas** as páginas de hub/lista usam o mesmo padrão do Back:  
  `div.flex.items-center.justify-start > <BackButton />`

---

## 3) SEO Técnico

- [x] `SEOHead` configurado (`/src/components/SEOHead.tsx`)
- [x] **Breadcrumbs** e **Schema** prontos para uso
- [x] **sitemap.xml** gerado por script  
  - Script: `npm run build:sitemap`  
  - Saída: `/public/sitemap.xml`
- [x] **robots.txt** (verificar se já existe) — liberar crawling e apontar sitemap

### Ações pendentes
- [ ] Em cada página nova, preencher:
  - `title`, `description`, `keywords` (quando fizer sentido)
  - `breadcrumbs` (Home → Categoria → Subcategoria → Página)
  - `schema` (HowTo para calculadora; CollectionPage para listagens)
- [ ] Criar/checar `public/robots.txt` com:
