const request = require('request');

const url = 'http://uinames.com/api';
const json = true;
const qs = { region: 'korea', amount: 3 };

request.get({ url, json, qs }, (err, res, result) => {
  if (err) {
    console.log('err: ', err);
    return;
  }

  if (res && res.statusCode >= 400) {
    console.log(res.statusCode);
    return;
  }

  result.forEach(person => {
    console.log(
      `${person.name}${person.surname} 님의 성별은 ${person.gender}입니다.`
    );
  });
});
