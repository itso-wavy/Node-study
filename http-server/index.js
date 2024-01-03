'use strict';

const http = require('http');
const url = require('url');

const port = 3000;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  // createServer: TCP 서버 인스턴스를 생성하고 req, res를 콜백함수로 전달함
  /* 
  // http 메시지(req, res)에 정보를 담아 교환
  // 상태, 헤더, 바디 정보 / 설정 후 end 알림
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n'); // 필수! */

  switch (req.method) {
    case 'GET':
      if (req.url === '/') {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        res.end('Hello! NodeJS HTTP server');
      } else if (req.url.substring(0, 5) === '/data') {
        const queryParams = url.parse(req.url, true).query;
        // http://host[:post][/][path][?query]
        // true 옵션을 추가시 반환값을 json 형태로 받을 수 있음

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.write('<html><head><title>Return HTML</title></head>'); // 응답 본문 작성

        for (let key in queryParams) {
          res.write(`<h1>${key}</h1>`);
          res.write(`<h2>${queryParams[key]}</h2>`);
        }

        res.end(`</body></html>`);

        // http://localhost:3000/data?qs1=key1&qs2=key2
        // 결과: qs1, key1, qs2, key2
      }
      break;
    case 'POST':
      let body = '';

      req.on('data', buffer => {
        // 'data', 'end' 이벤트를 등록
        body += buffer; // buffer 형식의 data를 string으로 형변환
      });
      req.on('end', () => {
        // 'data', 'end' 이벤트를 등록
        const obj = qs.parse(body);
        res.writeHead(200);
        res.end(JSON.stringify(obj));
      });
      req.on('error', err => {
        console.error(err.stack);
      });
      break;
    default:
      res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ 🤴`);
});

/* $ node . 
Server running at http://127.0.0.1:3000/ */
