// 1: 외부 모듈+라우터 모듈 불러옴. app 객체 생성
const createError = require('http-error');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const apiRouter = require('./routes/api');
const app = express();

// 2: 애플리케이션에 미들웨어 등록
app.use(logger('dev')); // 개발환경 로깅
app.use(express.json()); // 요청 본문 파싱
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 요청 내 쿠키 파싱
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

app.use('/api/game', apiRouter); // 엔드포인트 라우팅

require('./services/index').readyGame();

// 3: 404 에러, 오류 처리와 앱 실행
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // 오류 처리 미들웨어
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  res.status(err.status || 500);
  res.send(err);
});

app.listen(3000);

// 4: 예기치 않은 예외 / 거부된 프로미스 작업 처리
process.on('uncaughtException', err => {
  console.error('uncaughtException', err);

  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('unhandledRejection', err);

  process.exit(1);
});

console.log('express 애플리케이션이 시작됩니다 :)');

module.exports = app;
