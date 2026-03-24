import { chromium } from 'playwright';
import * as fs from 'fs';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/financial');
  await page.waitForTimeout(2000);
  
  const nav = await page.$('nav[aria-label="Breadcrumb"]');
  let result = {};
  if (nav) {
    result.box = await nav.boundingBox();
    
    // Check computed styles
    result.styles = await page.evaluate(el => {
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
    
    result.isVisible = await nav.isVisible();
    
    // Let's get the parent styles
    result.pstyles = await page.evaluate(el => {
      const p = el.parentElement;
      const c = window.getComputedStyle(p);
      return { tag: p.tagName, display: c.display, height: c.height };
    }, nav);

    // Get the header styles as well
    const header = await page.$('header');
    if (header) {
      result.hBox = await header.boundingBox();
    }

  } else {
    result.error = 'Nav not found';
  }
  
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2), 'utf-8');
  await browser.close();
})();
