const franc = require('franc');
const langs = require('langs');
const colors = require('colors');

const input = process.argv[2];
const langCode = franc(input);

if (langCode === 'und') {
  console.log("SORRY, COULDN'T FIGURE IT OUT!".blue);
} else {
  const language = langs.where('3', langCode);
  console.log(language.name.blue);
}

// node index.js 'এটি একটি ভাষা একক IBM স্ক্রিপ্ট'
