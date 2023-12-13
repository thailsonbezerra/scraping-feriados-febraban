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

  for (let uf of ufList) {
    if(uf === 'UF') continue;

    await page.select('#Uf', uf);
    await delay(2000);

    const MunicipioList = await page.$$eval('#Municipio > option', options => {
        return options.map(option => option.textContent.trim());
      });

      console.log(MunicipioList)

    for (let municipio of MunicipioList) {
        if(municipio === 'Selecione um Município') continue;
        
        console.log(municipio)

        await page.select('#Municipio', `${municipio}`);
        await delay(2000);

        await page.click('.botao');

        await delay(2000)
    }

  }

  await browser.close();

  process.exit()
})();