@echo off
echo Removendo git lock...
del /f "%~dp0.git\index.lock" 2>nul
echo.
echo Adicionando arquivos...
git -C "%~dp0" add src/components/Footer.tsx src/components/GlobalSearch.tsx src/components/Header.tsx src/components/Breadcrumbs.tsx src/components/home/HeroSection.tsx src/components/ads/AdSidebarRight.tsx src/components/layouts/AdRailLayout.tsx src/pages/categories/
echo.
echo Fazendo commit...
git -C "%~dp0" commit -m "feat: ui improvements — search synonyms, hero stats, mobile nav, footer SEO column, category icons teal, breadcrumb accent"
echo.
echo Pronto! Pressione qualquer tecla para fechar.
pause
