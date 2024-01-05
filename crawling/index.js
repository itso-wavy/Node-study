const cheerio = require('cheerio');
const fs = require('fs');

fs.readFile('./list.html', (err, data) => {
  if (err) return console.log(err);

  const $ = cheerio.load(data);

  const SET = new Set();

  $('.b-lyemeb img.b-719vri').each(function () {
    const alt = $(this).attr('alt');
    if (alt) SET.add(alt);
  });

  const ARRAY = Array.from(SET).sort(); // 이름순 정렬

  const listFilePath = 'list.txt';
  fs.writeFileSync(listFilePath, ARRAY.join('\n'));

  console.log('process complete 🦔👍');
});
