const cowsay = require('cowsay');

console.log(
  cowsay.say({
    text: "You're good",
    e: '^^',
    T: 'w ',
  })
);

console.log(
  cowsay.think({
    text: 'stupid',
    e: 'oO',
    T: 'U ',
  })
);
