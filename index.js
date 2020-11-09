const fs = require('fs')
const cheerio = require('cheerio');

const file = fs.readFileSync('./assets/稻田里的极简民宿.html')
const $ = cheerio.load(file)

// console.log($('img[data-src]').data('src'));

// $('img[data-src]').each((i, item) => {
//   console.log($(item).data('src'));
// })
let count = 1;
let groupName = '稻田里的极简民宿'
let outDir = './out'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const out = fs.createWriteStream(`${outDir}/稻田里的极简民宿.txt`)
$('section,p').each((i, item) => {
  if ($(item).find('span').text().startsWith('▼')) {
    groupName = $(item).find('span').text().replace(/\s+/g, '').slice(1)
  }
  if ($(item).find('img').length > 0) {
    const $img = $(item).find('img')
    const src = $img.data('src')
    const imgName = `${count}_${groupName}.${$img.data('type')}`
    count++
    out.write(`${src}\n\tout=${imgName}\n`)
  }
})
out.end()