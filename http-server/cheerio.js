const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

fs.readFile('./example.html', (err, data) => {
  // 로컬 파일 시스템 탐색
  if (err) return console.log(err);

  const $ = cheerio.load(data);

  console.log(
    'list count: ',
    $('.sidebar-content', '.sidebar').find('li').length
  ); // .sidebar 내 .sidebar-content 내 li

  console.log('summary: ', $('.infobox-title.summary').text()); // "HTML"
});

request('https://ko.wikipedia.org/wiki/HTML', (err, res, html) => {
  if (err) return console.log(err);
  if (res && res.statusCode >= 400) return console.log(res.statusCode);

  const $ = cheerio.load(html);

  console.log(
    'title: ',
    $('table[class="infobox vevent"]').find('.infobox-title').children().text()
  ); // (HyperText Markup Language)
});
