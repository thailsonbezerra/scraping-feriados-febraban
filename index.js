import * as puppeteer from 'puppeteer';
import delay from './utils/delay.js';
import { findCity } from './repositories/CitiesRepository.js';
import { createHoliday, findHoliday } from './repositories/HolidaysRepository.js';

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
    await delay(2500)
  
    const MunicipioList = await page.$$eval('#Municipio > option', options => {
        return options.map(option => option.textContent.trim());
      });

    for (let municipio of MunicipioList) {
        if(municipio === 'Selecione um Município') continue;
        
        const cities = await findCity(uf, municipio);

        if(cities.length === 0) {
          console.log(`Cidade ${municipio} não encontrada para o estado ${uf}`)
          continue
        }
         await page.select('#Municipio', `${municipio}`);
         await delay(2500)
         await page.click('.botao');
         await delay(2500)

         const feriadosRows = await page.$$eval('#tbodyMunicipais > tr', trs => {
           return trs.map(tr => {
             const tds = tr.querySelectorAll('td');
             return Array.from(tds).map(td => td.textContent.trim());
           });
 _       })

         const feriados = feriadosRows.map(row => ({
           data: {
             dia: +row[0].split('/')[0],
             mes: +row[0].split('/')[1],
             ano: +row[0].split('/')[2].substring(0, 4),
           },
           nome: `${row[0]} - ${row[2]}/${row[1]}`,
           estado: row[1],
           municipio: row[2],
           tipo: row[3],
         }));

         for (const feriado of feriados) {
            const { dia, mes, ano } = feriado.data;
            const { nome } = feriado;
            const cityId = +cities[0].id;

            const holidays = await findHoliday(dia, mes, ano, cityId);

            if(holidays.length > 0) {
              console.log(`Feriado ${nome} já cadastrado para a cidade ${municipio} - ${uf}`);
              continue;
            }
            
            console.log(`Cadastrando feriado ${nome} para a cidade ${municipio} - ${uf}`);
            await createHoliday(cityId, dia, mes, ano, nome, 2);
          }
                 
       // process.exit()
    }

  }

  await browser.close();

  process.exit()
})();