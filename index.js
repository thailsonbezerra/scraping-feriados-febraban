import * as puppeteer from 'puppeteer';
import delay from './utils/delay.js';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://feriadosbancarios.febraban.org.br/Municipais/Listar');

  await page.setViewport({width: 1080, height: 1024});
  await page.waitForSelector('.botao');

  const ufList = await page.$$eval('#Uf > option', options => {
    return options.map(option => option.textContent);
  });

  console.log(ufList)

  for (let uf of ufList) {
    if(uf === 'UF') continue;

    await page.select('#Uf', uf);
  }

  await page.click('.botao');

  await delay(10000);

  await browser.close();

  process.exit()
})();