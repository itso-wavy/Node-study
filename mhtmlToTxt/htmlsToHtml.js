// cmd ex: node 'htmlsToHtml' 1 '제목' 1

const fs = require('fs');
const { JSDOM } = require('jsdom');
const { EBOOK_PATH, DOMAIN, FOLDER } = require('./constants');

const getFileNameTemplate = (domain, episode) => {
  switch (domain) {
    case 'ridi':
      return ` ${episode}화 - 리디`;
    default:
      return episode;
  }
};

function htmlToTxt(filePath, outputFilePath) {
  const htmlFileName = filePath + `.html`;
  const html = fs.readFileSync(htmlFileName).toString();
  const trimmedHtml = html.replaceAll('user-select:none', '');

  const dom = new JSDOM(trimmedHtml);
  const document = dom.window.document;

  const pagesElements = document.querySelectorAll(
    'div.pages > article.chapter'
  );

  const rightElement = document.querySelector('.content_footer');
  rightElement.parentNode.removeChild(rightElement);

  Array.from(pagesElements).forEach(article => {
    article.parentNode.removeChild(article);
  });

  const newHtml = Array.from(pagesElements)
    .filter(article => !article.querySelector('img'))
    .map(ele => ele.outerHTML)
    .join('');

  fs.writeFileSync(outputFilePath, newHtml, {
    encoding: 'utf8',
    flag: 'a',
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
        file.endsWith(fileNameTemplate + '.html')
      ) {
        fs.unlink(filePath, err => {});

        ++episode;
        fileNameTemplate = getFileNameTemplate(DOMAIN, episode);
      }
    });
  });
}

async function htmlsToHtml(process) {
  let [, , folderNumber, title, startEpisode] = process.argv;
  let innerFolder = [];

  let folderType;
  switch (folderNumber) {
    case '0':
      folderType = '0 read';
      innerFolder = ['[OLD]', '[60]'];
      break;
    case '1':
      folderType = '1 continuous';
      innerFolder = ['[$]'];
      break;
    case '2':
      folderType = '2 test';
      break;
    default:
      folderType = '';
  }

  innerFolder.forEach(folder => {
    if (FOLDER[folderType][folder][title]) {
      folderType = '0 read/' + folder;
    }
  });

  if (process.argv.length < 5) {
    title = process.argv[2];
    startEpisode = process.argv[3];
  }

  let currentEpisode = startEpisode;

  let folderPath = EBOOK_PATH + `/${folderType}/${title}/`;
  if (!folderType) folderPath = EBOOK_PATH + `/${title}/`;

  let filePath =
    folderPath + title + getFileNameTemplate(DOMAIN, currentEpisode);
  let outputFilePath = folderPath + `${startEpisode}.html`;

  async function checkNextFileExist() {
    while (fs.existsSync(filePath + '.html')) {
      htmlToTxt(filePath, outputFilePath);

      console.log(title, currentEpisode);

      currentEpisode++;
      filePath = folderPath + `${title} ${currentEpisode}화 - 리디`;
      filePath =
        folderPath + title + getFileNameTemplate(DOMAIN, currentEpisode);
    }

    let newFileName = folderPath + `${title} ${startEpisode}`;
    if (startEpisode != currentEpisode - 1) {
      newFileName =
        folderPath + `${title} ${startEpisode}-${currentEpisode - 1}`;
    }

    fs.renameSync(outputFilePath, newFileName + '.html', error => {
      console.log('txt 파일명 수정 불가!');
    });

    fs.writeFileSync(newFileName + '.txt', '');
  }

  await checkNextFileExist();
  await deleteRestFiles(folderPath, startEpisode);

  console.log('\nprocess complete ᕙ( •̀ ᗜ •́ )ᕗ');
}

htmlsToHtml(process);

// module.exports = htmlsToHtml;
