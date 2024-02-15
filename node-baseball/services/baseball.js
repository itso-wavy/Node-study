'use strict';

const shortId = require('shortid'); // A-Z,a-z, 0-9,_- 조합 아이디 생성
const { getRandomInt } = require('./utils.js');

const answerSymbol = Symbol('answer');
// const baseball = new Baseball();
// console.log(baseball.answer) 같은 방법으로 접근 불가하도록 함

class Baseball {
  constructor(
    id = shortId.generate(),
    answer, // undefined
    digit = 3,
    done = false,
    history = []
  ) {
    this.id = id;
    this.digit = digit;
    this.done = done;
    this.history = [];
    this[answerSymbol] = answer || Baseball.makeAnswer(digit);
  }

  getId() {
    return this.id;
  }
  getAnswer() {
    return this[answerSymbol];
  }
  getDigit() {
    return digit;
  }
  getDone() {
    return done;
  }
  addHistory(result) {
    this.history.push(result);
  }
  setDone(done) {
    this.done = done;
  }
  matchAnswer(guess) {
    let strike = 0;
    let ball = 0;

    const answer = this.getAnswer(); // 심볼값에 접근
    answer.forEach((v, i) => {
      if (guess[i] === v) {
        strike++;
      } else if (answer.indexOf(guess[i]) > -1) {
        ball++;
      }
    });

    return new Result(strike, ball);
  }

  static makeAnswer(digit) {
    let problem = [];
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < digit; i++) {
      let max = 9 - i;
      let index = getRandomInt(0, max);

      problem.push(numbers[index]);
      numbers.splice(index, 1);
    }

    return problem;
  }

  static toObject(data) {
    // DB의 데이터로 인스턴스 생성: 중단된 게임 재개, 이전 게임 정보 확인 등
    const { id, answer, digit, done, history } = data;
    return new Baseball(id, answer, digit, done, history);
  }

  attachedAnswer() {
    // 현재 인스턴스를 복사하고 { answer } 속성을 추가
    return Object.assign({}, this, { answer: this.getAnswer() });
  }
}

class Result {
  constructor(strike, ball) {
    this.strike = strike;
    this.ball = ball;
  }

  toString() {
    let resultString = `${this.strike}S${this.ball}B`;
    if (this.strike === 0 && this.ball === 0) {
      resultString = 'OUT';
    }
    return resultString;
  }
}

module.exports = Baseball;
