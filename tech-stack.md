# Documentação Técnica do Projeto

## 1. Identidade do Core
**Linguagem Principal:** TypeScript
**Framework:** React (v18)
**Build Tool:** Vite (v5)

## 2. Estilo e UI
**Engine de CSS:** Tailwind CSS (v3.4)
**Biblioteca de Componentes:** Shadcn/ui (Baseado em Radix UI + Tailwind + CVA)
**Ícones:** Lucide-React, React Icons, Simple Icons

## 3. Estrutura e Estado
**Gerenciamento de Estado:** React Context API + TanStack Query (v5)
**Formulários:** React Hook Form + Zod
**Roteamento:** React Router Dom (v6)

## 4. Resumo para Agentes de IA
"Este projeto é uma **Single Page Application (SPA)** construída com React e Vite.
A estrutura de pastas segue uma organização híbrida:
- `src/components/ui`: Componentes base reutilizáveis (Padrão Shadcn).
- `src/pages`: Componentes de página (Roteamento).
- `src/components/calculators`: Componentes de funcionalidade específica (Feature-based).

Para criar novos componentes, siga o padrão de composição do Radix UI e estilização com utility-first classes do Tailwind."
