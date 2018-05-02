const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const data = JSON.parse(await readFile('data.json'));
    const browser = await puppeteer.launch();

    for (let personIndex in data) {
      const person = data[personIndex];

      const page = await browser.newPage();
      await page.goto('http://localhost:3000/register');

      for (let field in person) {
        if (field === 'genre') {
          await page.click(`.el-radio__original[value=${person[field]}]`);
        } else {
          await page.type(`#${field}`, person[field]);
        }
      }

      await page.click('.el-checkbox__original[name=terms]');

      await page.click('.register-button');
      await (new Promise(resolve =>
        page.once('response', () => resolve())
      ));

      // await page.screenshot({
      //   path: `example-${person.email}.png`,
      //   fullPage: true
      // });
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}
