/* 1️⃣ 필요 모듈 불러오기 */
const createError = require('http-errors'); // 4~500번대의 HTTP 오류를 생성해주는 모듈
const express = require('express'); // 간편하게 웹 애플리케이션, API 구축을 위한 웹 프레임워크
const path = require('path'); // 파일 경로 관련 모듈
const cookieParser = require('cookie-parser'); // HTTP 요청(req)에 동봉된 쿠키를 파싱하는 데 사용하는 모듈
const logger = require('morgan'); // HTTP 요청에 대한 로깅을 처리하는 모듈

/* 2️⃣ 라우팅 대상 파일 불러오기 */
const apiRouter = require('./routes/api');

const app = express();

/* view engine setup */
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

/* 3️⃣ app.use로 써드파티 미들웨어(추가적인 기능을 제공하기 위한 미들웨어 모듈) 추가 */
app.use(logger('dev')); // 로깅
app.use(express.json()); // 데이터를 JSON 형태로 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 형식의 데이터 파싱
app.use(cookieParser()); // 쿠키 파싱, 요청 객체에 cookies 속성 추가됨
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공
/* 
app.use(express.urlencoded({ extended: false })) // put, post 등의 요청에서 요청 본문에 담긴 URL-encoded 형식의 데이터를 파싱하여 request 객체의 body에 넣어줌

GET: URL에 쿼리스트링 형태로 데이터가 직접 노출됨
- 쿼리스트링: `?name=John&age=25&city=New+York`
- reqest.query를 사용해 자동 파싱됨
POST/PUT: body 안에 URL-encoded 형태로 데이터가 노출되지 않고 담김
- URL-encoded: `name=John&age=25&city=New+York`
- express.urlencoded 미들웨어를 사용하여 URL-encoded 형태를 해석하는 과정이 필요함
*/

app.use('/api/game', apiRouter);

require('./services/index').readyGame();

/* 4️⃣ 404 에러 생성 */
app.use((req, res, next) => {
  next(createError(404)); // 404 에러 객체 생성, next()를 통해 다음 미들웨어 함수로 제어권 전달
});

/* 에러 처리 */
app.use((err, req, res, next) => {
  /* set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  console.log(err);
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

process.on('uncaughtException', err => {
  console.error('uncaughtException', err);
  process.exit(1); // 이벤트 루프에 빠졌을 때, promise 거절됐을 때 비정상종료
});
process.on('unhandledRejection', err => {
  console.error('unhandledRejection', err);
  process.exit(1);
});

module.exports = app; // 모듈로 app.js 실행시 express app 실행
