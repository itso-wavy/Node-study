const express = require('express');
const multer = require('multer'); // multer가 무슨 라이브러리지?
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const UPLOAD_PATH = 'uploads/';
const storage = multer.diskStorage({
  // 업로드 관련 설정 정보를 담은 옵션 객체 생성
  destination: (req, file, cb) => cb(null, UPLOAD_PATH), // 파일 저장 폴더
  filename: (
    req,
    file,
    cb // 파일 이름
  ) =>
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname) // 파일 이름 중복 방지를 위해 타임스탬프 추가
    ),
});
const upload = multer({ storage }); // 옵션 객체 전달

const app = express(); // 애플리케이션 인스턴스 생성

app.use((err, req, res, next) => {
  // 에러 처리 미들웨어 함수 작성
  // (에러, 요청객체, 응답객체, next 함수) => callback(에러 처리)
  res.status(500).send('파일 업로드 실패!');
});

app.get('/', (req, res, next) => {
  // (get 메서드 사용시 라우팅 경로, (요청, 응답, next))
  res.sendFile(path.join(__dirname, '/index.html')); // get으로 응답할 html
});

app.post('/upload', cors(), upload.single('file'), (req, res, next) => {
  // 라우팅 경로, cors 설정, file 업로드 관련 설정, 라우팅 되는 callback 작성
  if (!req.file) return next(400); // 요청 내 파일이 없으면 400 에러 반환 -> 25줄로 전달되어 에러 처리
  res.status(200).send('파일 업로드 성공!'); // 성공시 응답 메시지 전달
});

app.get('/file_list', cors(), (req, res, next) => {
  fs.readdir(path.join(__dirname, UPLOAD_PATH), (err, files) => {
    // UPLOAD_PATH의 파일 목록을 응답함
    if (err) return next(err);
    res.status(200).send(files);
  });
});

app.listen(3000); // http.Server 객체 반환, 서버 응답 대기

// http://localhost:3000
