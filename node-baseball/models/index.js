'use strict';

const fs = require('fs');
const path = require('path');

const FILEPATH = path.join(__dirname, 'data.json');

exports.readFile = () => {
  try {
    fs.openSync(FILEPATH, 'r'); // openSync: 파일 생성, 기본 설정 'r'

    const data = fs.readFileSync(FILEPATH, 'utf8');

    return JSON.parse(data);
  } catch (err) {
    throw err;
  }
};

const writeFile = (exports.writeFile = data => {
  if (typeof data !== 'string') data = JSON.stringify(data);

  try {
    fs.openSync(FILEPATH, 'wx'); // x: 기존 동일 파일 존재시 덮어쓰기 X
    fs.writeFileSync(FILEPATH, data, 'utf8');
  } catch (err) {
    try {
      if (err.code === ' EEXIST') {
        fs.unlinkSync(FILEPATH); // 기존 파일은 삭제하고 최신 data로 저장, 덮어쓰기는 비권장, 기존 파일 삭제 후 신규 파일 생성을 권장
        return writeFile(data);
      }
    } catch (err) {
      throw err;
    }
    throw err;
  }
});
