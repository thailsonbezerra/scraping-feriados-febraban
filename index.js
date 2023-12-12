import * as puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://feriadosbancarios.febraban.org.br/Municipais/Listar');

  await page.setViewport({width: 1080, height: 1024});
  await page.waitForSelector('.botao');

  await browser.close();
})();