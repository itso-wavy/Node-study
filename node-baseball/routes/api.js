'use strict';

const express = require('express');
const services = require('../services');
const createError = require('http-errors');

const router = express.Router();
/* router.route(path)
    .all(function(req, res, next){})
    .get(function(req, res, next){})
    .post(function(req, res, next){})
    .put(function(req, res, next){})
    .delete(function(req, res, next){})
*/
router.route('/').post(makeGame); // 게임 시작 및 자리수 설정
router.route('/list').get(getList); // 전체 게임 리스트 확인
router.route('/:id').get(getGame).delete(deleteGame); // 특정 게임 정보 확인 + 특정 게임 기록 삭제
router.route('/:id/guess').post(postGuess); // 게임 결과 확인

const checkError = err => {
  return err.code ? err : createError(500, err);
};

async function getList(req, res, next) {
  try {
    res.send(services.getGames());
  } catch (err) {
    next(checkError(err));
  }
}

async function makeGame(req, res, next) {
  console.log("Let's make good game");
  const digit = req.body.digit;

  try {
    const id = services.makeGame(digit);
    res.send({ id });
  } catch (err) {
    next(checkError(err));
  }
}

async function getGame(req, res, next) {
  const id = req.params.id;

  try {
    res.send(services.getGame(id));
  } catch (err) {
    next(checkError(err));
  }
}

async function deleteGame(req, res, next) {
  const id = req.params.id;

  try {
    res.send(services.removeGame(id));
  } catch (err) {
    next(checkError(err));
  }
}

async function postGuess(req, res, next) {
  const guess = req.body.guess ? req.body.guess.split('').map(g => +g) : [];
  const id = req.params.id;

  try {
    res.send(services.guessAnswer(id, guess));
  } catch (err) {
    next(checkError(err));
  }
}

module.exports = router;
