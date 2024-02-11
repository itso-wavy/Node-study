const fs = require('fs');
const path = require('path');

function makeFolder(folder, list) {
  list.forEach(([_, title], index) => {
    fs.mkdir(
      `${folder}/${Math.floor(index / 10) + 1}/${title.replaceAll('?', '_')}`,
      { recursive: true }, // 중간 경로 자동 생성 옵션
      err => {
        if (err) console.log(err);
      }
    );
    console.log(index + 1, title);
  });
}
function execute(folder, number, callback) {
  fs.readdir(path.join(folder, number), (err, fd) => {
    if (err) return console.log(err);

    fd.forEach(folder => callback(folder));
  });
}
function changeName(folder, list) {
  const newList = [];

  list.forEach(([writer, title]) => {
    title = title.replaceAll('?', '_');
    try {
      // const content = fs.readFileSync(`${folder}/${title} 1-30.txt`);

      fs.renameSync(
        `${folder}/${title} 1-30.txt`,
        `${folder}/${writer}${title} 1-30.txt`
      );
      // fs.writeFileSync(`${folder}/${writer}${title}.txt`, content);

      // fs.unlinkSync(`${folder}/${title} 1-30.txt`);
    } catch (err) {
      newList.push([writer, title]);
    }
  });

  return newList;
}

module.exports = { makeFolder, execute, changeName };
