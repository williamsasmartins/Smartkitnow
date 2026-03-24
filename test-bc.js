import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/financial');
  await page.waitForTimeout(2000);
  
  const nav = await page.$('nav[aria-label="Breadcrumb"]');
  if (nav) {
    const box = await nav.boundingBox();
    console.log('Nav box:', box);
    
    // Check computed styles
    const styles = await page.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        height: computed.height,
        position: computed.position,
        zIndex: computed.zIndex,
        marginTop: computed.marginTop,
        top: computed.top
      };
    }, nav);
    console.log('Nav styles:', styles);
    
    const isVisible = await nav.isVisible();
    console.log('Is vis:', isVisible);
    
    // Let's get the parent styles
    const pstyles = await page.evaluate(el => {
      const p = el.parentElement;
      const c = window.getComputedStyle(p);
      return { tag: p.tagName, display: c.display, height: c.height };
    }, nav);
    console.log('Parent styles:', pstyles);

    // Get the header styles as well
    const header = await page.$('header');
    if (header) {
      const hBox = await header.boundingBox();
      console.log('Header box:', hBox);
    }

  } else {
    console.log('Nav not found');
  }
  
  await browser.close();
})();
