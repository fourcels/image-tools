const fs = require('fs')
const cheerio = require('cheerio');
const path = require('path')

function padding(num, length) {
  let str = '' + num
  if (str.length < length) {
    str = '0'.repeat(length - str.length) + str
  }
  return str
}

function main() {
  const args = process.argv.slice(2);
  console.log(args);
  if (args.length === 0) {
    console.log('输入文件名');
    return
  }
  const fileName = args[0]

  const file = fs.readFileSync(fileName)
  const $ = cheerio.load(file)

  // console.log($('img[data-src]').data('src'));

  // $('img[data-src]').each((i, item) => {
  //   console.log($(item).data('src'));
  // })
  let count = 1;
  let groupName = path.basename(fileName, '.html')
  let outDir = './out'
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  const out = fs.createWriteStream(`${outDir}/${groupName}.txt`)
  $('section,p').each((i, item) => {
    if ($(item).find('span').text().startsWith('▼')) {
      groupName = $(item).find('span').text().replace(/\s+/g, '').slice(1)
    }
    if ($(item).find('img').length > 0) {
      const $img = $(item).find('img')
      const src = $img.data('src')
      const imgName = `${padding(count, 2)}_${groupName}.${$img.data('type')}`
      count++
      out.write(`${src}\n\tout=${imgName}\n`)
    }
  })
  out.end()
}

main()