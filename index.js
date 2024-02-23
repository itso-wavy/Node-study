const fs = require('fs');
const path = require('path');

/* 
비동기 메서드:
- 읽기: fs.readFile(path[, options], (err, data) => {})
- 쓰기: fs.writeFile(file, data[, options], (err) => {})
- 추가: fs.appendFile(path, data[, options], (err) => {})
- 파일 목록 읽기: fs.readdir(path[, options], (err, files) => {})
- 삭제: fs.unlink(path, (err) => {})
- 폴더 생성: fs.mkdir(path[, options], (err) => {})
- 폴더 삭제: fs.rmdir(path, (err) => {})
- 이름 변경: fs.rename(oldPath, newPath, (err) => {})

동기 메서드:
- 읽기: fs.readFileSync(path[, options])
- 쓰기: fs.writeFileSync(file, data[, options])
- 추가: fs.appendFileSync(path, data[, options])
- 파일 목록 읽기: fs.readdirSync(path[, options])
- 삭제: fs.unlinkSync(path)
- 폴더 생성: fs.mkdirSync(path[, options])
- 폴더 삭제: fs.rmdirSync(path)
- 이름 변경: fs.renameSync(oldPath, newPath)
*/

// 🖤 writeFile
function createFiles() {
  const PATH =
    'D:/babyWAVY/@repository/TS-the-typeinator/CaptainTypeScript/note';
  const chapter_base = 10;
  const subjects = [
    '타입 추론',
    '타입 단언',
    '타입 가드',
    '타입 호환',
    '타입 모듈',
    '유틸리티 타입',
    '맵드 타입',
  ];

  subjects.forEach((subject, index) => {
    fs.writeFile(
      PATH + `/ch${chapter_base + index + 1}.ts`,
      `// 💙ch${chapter_base + index + 1}. ${subjects[index]}`,
      '',
      err => {
        if (err) console.log('ERROR!', err);
      }
    );
  });
}

// 🖤 readFile, appendFile, readdir, unlink, rename & fs.promises📏
async function renameTxtTitle() {
  const TITLE = process.argv[2];

  const PATH = path.join('H:/내 드라이브/Ebooks/1 old/[TRY]', TITLE);

  fs.readdir(PATH, async (err, files) => {
    const novel = files.shift();
    let writer = novel.match(/\[(.*?)\]/);
    writer = writer ? writer[0] : '';
    const lastEpisode = files.at(-1).match(/-(\d+)/)[1];
    files = files.sort();

    for (let file of files) {
      const text = await fs.promises.readFile(path.join(PATH, file), 'utf8');
      await fs.promises.appendFile(path.join(PATH, novel), text, err => {});
      await fs.promises.unlink(path.join(PATH, file));
    }
    await fs.promises.rename(
      path.join(PATH, novel),
      path.join(PATH, `${writer}${TITLE} 1-${lastEpisode}.txt`)
    );

    console.log('process complete!');

    if (err) console.log('ERROR!', err);
  });
}
renameTxtTitle();
