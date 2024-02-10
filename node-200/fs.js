const fs = require('fs');
const path = require('path');

const fileName = 'file.txt';
const folderName = 'folder';
const folderPath = path.join(__dirname, folderName, fileName);
console.log(path.parse(folderPath));
/* {
  root: 'D:/',
  dir: 'D:/babyWAVY/@repository/NodeJS-study/folder',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
} */

const callback = err => {
  if (err) return console.log(err);
};

fs.open(path, 'r', (err, fd) => {
  // fd = "file" descriptor
  if (err && err.code === 'ENOENT')
    return console.log('파일이 존재하지 않습니다.');
  if (err) return console.log(err);

  console.log('파일이 존재합니다.');

  fs.close(fd, err => {
    if (err) return console.log(err);
  });
});
fs.stat(path, (err, stats) => {
  // stats = statistics
  if (err) return console.log(err);
  return stats;
});
fs.access(path, fs.constants.F_OK, err => {
  // fs.constants.F_OK: 파일 존재 여부 확인
  // 동기적 처리 버전이 fs.existsSync()
  if (err) return console.log('파일이 존재하지 않습니다.');
  return console.log('파일이 존재합니다.');
});
console.log(fs.constants);
/* {
  UV_FS_SYMLINK_DIR: 1,
  UV_FS_SYMLINK_JUNCTION: 2,
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  UV_DIRENT_UNKNOWN: 0,
  UV_DIRENT_FILE: 1,
  UV_DIRENT_DIR: 2,
  UV_DIRENT_LINK: 3,
  UV_DIRENT_FIFO: 4,
  UV_DIRENT_SOCKET: 5,
  UV_DIRENT_CHAR: 6,
  UV_DIRENT_BLOCK: 7,
  EXTENSIONLESS_FORMAT_JAVASCRIPT: 0,
  EXTENSIONLESS_FORMAT_WASM: 1,
  S_IFMT: 61440,
  S_IFREG: 32768,
  S_IFDIR: 16384,
  S_IFCHR: 8192,
  S_IFIFO: 4096,
  S_IFLNK: 40960,
  O_CREAT: 256,
  O_EXCL: 1024,
  UV_FS_O_FILEMAP: 536870912,
  O_TRUNC: 512,
  O_APPEND: 8,
  S_IRUSR: 256,
  S_IWUSR: 128,
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1,
  UV_FS_COPYFILE_EXCL: 1,
  COPYFILE_EXCL: 1,
  UV_FS_COPYFILE_FICLONE: 2,
  COPYFILE_FICLONE: 2,
  UV_FS_COPYFILE_FICLONE_FORCE: 4,
  COPYFILE_FICLONE_FORCE: 4
} */

fs.mkdir(path, { recursive: true }, callback);
fs.rmdir(path, callback);
fs.readdir(path, callback);

fs.writeFile(path, 'contents', callback);
fs.readFile(path, callback);
fs.appendFile(path, 'contents', callback);
fs.rename(path, 'new-path', callback);
fs.unlink(path, callback);
// 'utf-8'이 기본 옵션이므로 명시하지 않아도 됨

// 동기적 함수의 에러 처리시 try-catch 사용
try {
  fs.writeFileSync(path, 'contents');
} catch (err) {
  console.log(err);
}
