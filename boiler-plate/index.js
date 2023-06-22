// https://expressjs.com/ko/
// Node.js 서버 생성 프레임워크
// HTTP 유틸리티 메소드 및 미들웨어 제공 -> API 작성
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config/key');
const { user } = require('./models/User');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 라우팅: 애플리케이션 엔드 포인트(URI)의 정의, URI가 클라이언트 요청에 응답하는 방식
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const port = 5000;

app.get(port, (req, res) => res.send(`Example app listening on port ${port}!`));

app.get('/home', (req, res) => res.send('안녕하세요'));

app.post('/api/users/register', (req, res) => {
  //유저 회원가입시 정보를 client에서 받아와서 body-parser를 거친 후 데이터베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
