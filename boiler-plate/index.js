// https://expressjs.com/ko/
// Node.js 서버 생성 프레임워크
// HTTP 유틸리티 메소드 및 미들웨어 제공 -> API 작성
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User'); // 유저 모델 가져오기

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.get('/', (req, res) => res.send('안녕하세요'));

app.get('/api/hello', (req, res) => res.send('안녕하세요, 여기는 home page'));

app.post('/api/users/register', (req, res) => {
  // client에서 유저 회원가입 정보를 받아와서 body-parser를 거친 후 데이터베이스에 넣어줌
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // console.log('ping')
  // 요청 이메일을 데이터베이스에서 탐색
  User.findOne({ email: req.body.email }, (err, user) => {
    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 요청 이메일이 데이터베이스에 있다면 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      //비밀번호까지 일치하면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 쿠키나 로컬스토리지에 저장
        res
          .cookie('x_auth', user.token) // 쿠키 내 x_auth: $$$ 형태
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// role 0이면 일반유저 / role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
  // 미들웨어를 통과해 여기까지 왔다는 건 Authentication이 True
  res.status(200).json({
    // 상태 200 + 유저 정보 넣어주기
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  // 로그아웃시 토큰을 지움
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
