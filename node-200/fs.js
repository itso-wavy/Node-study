// node fs.js

const fs = require('fs');

// 1. 쓰기
// fs.write(path, contents, callback)
// fs.writeFileSync(path, contents)
const contents = 'good\nmorning';
const contents2 = 'good\nnight';

fs.writeFile('./message.txt', contents, () => {});
fs.writeFileSync('./message-sync.txt', contents2);

// 2. 읽기
// fs.readFile(path, callback)
// fs.readFileSync(path)
const message = fs.readFile('./message.txt', (err, data) => {
  console.log('string: ', data.toString());
});
const message2 = fs.readFileSync('./message-sync.txt');

console.log('string2: ', message2.toString());

// 3. 수정
// readFile => writeFile
fs.readFile('./message.txt', (err, data) => {
  let contents = data.toString();
  contents = '!EDITED\n' + contents;

  fs.writeFile('./message.txt', contents, () => {});
});

// 3-2. 내용 추가
// fs.appendFile(path, contents, callback)
// fs.appendFileSync(path, contents)
const list = [1, 2, 3, 4, 5];

list.forEach(item =>
  fs.appendFile('./message.txt', `\ncount ${item}`, () => {})
);

list.forEach(item =>
  fs.appendFileSync('./message-sync.txt', `\ncount ${item}`)
);

const addedContents = fs.readFileSync('./message-sync.txt').toString();
console.log(addedContents);
