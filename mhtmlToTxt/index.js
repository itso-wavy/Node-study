// 1. mhtmlToHtml
// 2. htmlToTxt
// 3. checkNextFileExist
// 4. 쓸 데 없는 png, mhtml, html 등을 삭제

const fs = require('fs');
const { JSDOM } = require('jsdom');
const { exec } = require('child_process');
let {
  EBOOK_PATH,
  PYTHON_SCRIPT_PATH,
  RIGHT_ELEMENT_STYLE,
  DOMAIN,
  FOLDER,
} = require('./constants');
const BIG_FOLDER = Object.keys(FOLDER);
// const htmlsToHtml = require('./htmlsToHtml');

const getFileNameTemplate = (domain, episode) => {
  switch (domain) {
    case 'ridi':
      return ` ${episode}화 - 리디`;
    default:
      return episode;
  }
};

async function mhtmlToHtml(filePath, ...log) {
  return new Promise((resolve, reject) => {
    exec(`python "${PYTHON_SCRIPT_PATH}" "${filePath}"`, (error, stdout) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      console.log(...log);

      resolve(stdout);
    });
  });
}

function htmlToTxt(filePath, outputFilePath) {
  const htmlFileName = filePath + `.html`;
  const html = fs.readFileSync(htmlFileName).toString();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const textElements = document.querySelectorAll('body > div > p');
  const excludeElementIndex = Array.from(textElements).findIndex(
    $ele => $ele.getAttribute('style') === RIGHT_ELEMENT_STYLE
  );

  const includedElements = Array.from(textElements).slice(
    1,
    excludeElementIndex
  );

  includedElements.forEach(ele => {
    const content = ele.textContent + '\n\n';

    fs.writeFileSync(outputFilePath, content, {
      encoding: 'utf8',
      flag: 'a',
    });
  });
}

function deleteRestFiles(folderPath, startEpisode) {
  let episode = startEpisode;
  let fileNameTemplate = getFileNameTemplate(DOMAIN, episode);

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.sort((a, b) => {
      const getNumberPart = str => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : NaN;
      };

      const aNumber = getNumberPart(a);
      const bNumber = getNumberPart(b);

      return aNumber - bNumber || a.localeCompare(b, 'en', { numeric: true });
    });

    files.forEach(file => {
      const filePath = folderPath + file;

      if (
        file.endsWith('리디.001.png') ||
        file.endsWith(fileNameTemplate + '.html') ||
        file.endsWith(fileNameTemplate + '.mhtml')
      ) {
        fs.unlink(filePath, err => {});

        if (file.endsWith('.mhtml')) {
          ++episode;
          fileNameTemplate = getFileNameTemplate(DOMAIN, episode);
        }
      }
    });
  });
}

async function mhtmlToTxt(process) {
  let [, , folderNumber, title, startEpisode] = process.argv;
  let innerFolder = [];

  let folderType = BIG_FOLDER[folderNumber];

  if (process.argv.length < 5) {
    title = process.argv[2];
    startEpisode = process.argv[3];

    console.log(title, startEpisode);
  } else {
    innerFolder = Object.keys(FOLDER[folderType]).filter(
      folder => typeof FOLDER[folderType][folder] === 'object'
    );

    innerFolder.forEach(folder => {
      if (FOLDER[folderType] && FOLDER[folderType][folder][title]) {
        folderType = folderType + '/' + folder;
      }
    });
  }

  let currentEpisode = startEpisode;

  let folderPath = EBOOK_PATH + `/${folderType}/${title}/`;
  if (!folderType) folderPath = EBOOK_PATH + `/${title}/`;

  let filePath =
    folderPath + title + getFileNameTemplate(DOMAIN, currentEpisode);
  let outputFilePath = folderPath + `${startEpisode}.txt`;

  async function checkNextFileExist() {
    while (fs.existsSync(filePath + '.mhtml')) {
      await mhtmlToHtml(filePath, title, +currentEpisode);
      htmlToTxt(filePath, outputFilePath);

      currentEpisode++;
      filePath =
        folderPath + title + getFileNameTemplate(DOMAIN, currentEpisode);
    }

    let newFileName = folderPath + `${title} ${startEpisode}.txt`;
    if (startEpisode != currentEpisode - 1) {
      newFileName =
        folderPath + `${title} ${startEpisode}-${currentEpisode - 1}.txt`;
    }

    fs.renameSync(outputFilePath, newFileName, error => {
      console.log('txt 파일명 수정 불가!');
    });
  }

  await checkNextFileExist();
  await deleteRestFiles(folderPath, startEpisode);

  console.log('\nprocess complete ᕙ( •̀ ᗜ •́ )ᕗ');
}

if (!process.argv[3] || (process.argv[3] && process.argv[3].startsWith('['))) {
  let folderNumber = process.argv[2];
  let folderType = BIG_FOLDER[folderNumber];

  if (!process.argv[3])
    for (let title in FOLDER[folderType]) {
      const startEpisode = FOLDER[folderType][title];
      if (typeof startEpisode === 'object') continue;

      const process = { argv: [, , folderNumber, title, startEpisode] };

      mhtmlToTxt(process);
    }
  if (process.argv[3]) {
    const innerFolderType = process.argv[3].toUpperCase();
    for (let title in FOLDER[folderType][innerFolderType]) {
      const startEpisode = FOLDER[folderType][innerFolderType][title];
      const process = { argv: [, , folderNumber, title, startEpisode] };
      mhtmlToTxt(process);
    }
  }
} else mhtmlToTxt(process);
// htmlsToHtml(process)
