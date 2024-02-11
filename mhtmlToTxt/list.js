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
async function changeName(folder, list) {
  const newList = [];

  for (let [writer, title] of list) {
    title = title.replaceAll('?', '_');

    await new Promise((resolve, reject) => {
      fs.rename(
        `${folder}/${title} 1-30.txt`,
        `${folder}/${writer}${title} 1-30.txt`,
        err => {
          if (err) {
            fs.rename(
              `${folder}/${title} 0-30.txt`,
              `${folder}/${writer}${title} 0-30.txt`,
              err => {
                if (err) newList.push([writer, title]);

                resolve();
              }
            );
          }
          resolve();
        }
      );
    });
  }

  console.log('newList: ', newList);
}
// function changeName(folder, list) {
//   const newList = [];

//   list.forEach(([writer, title]) => {
//     title = title.replaceAll('?', '_');

//     fs.rename(
//       `${folder}/${title} 1-30.txt`,
//       `${folder}/${writer}${title} 1-30.txt`,
//       () => {
//         fs.rename(
//           `${folder}/${title} 0-30.txt`,
//           `${folder}/${writer}${title} 0-30.txt`,
//           () => newList.push([writer, title])
//         );
//       }
//     );
//   });
//   // .then(console.log('newList: ', newList));
// }

module.exports = { makeFolder, execute, changeName };
