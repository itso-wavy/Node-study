const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10자리 salt 생성=> 비밀번호 암호화
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  // next => index.js 내 user.save로 이동
  var user = this;

  if (user.isModified('password')) {
    // 유저 정보 중 비밀번호 변경시에만 비밀번호를 암호화함
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    // 유저 정보 중 기타 정보 변경시엔 암호화하지 않음
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567
  // 암호화 된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); // 에러 없고, 일치한다
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  // jsonwebtoken 이용해서 token 생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user); // 에러 없고, ~
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // user._id + ''  = token

  // 토큰 복호화
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // 유저 아이디로 유저를 탐색 후
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
