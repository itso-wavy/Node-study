// https://expressjs.com/ko/
// Node.js 서버 생성 프레임워크
// HTTP 유틸리티 메소드 및 미들웨어 제공 -> API 작성

const express = require('express');
const app = express();

// 라우팅: 애플리케이션 엔드 포인트(URI)의 정의, URI가 클라이언트 요청에 응답하는 방식

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world');
});
