const http = require('http');

const port = 3000;
const hostname = '127.0.0.1';

/* 1️⃣ 서버 인스턴스 생성 */
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

/* 2️⃣ 서버 이벤트 리스닝, 지정 포트와 호스트에서 들어오는 응답을 구독함 */
server.listen(port, hostname, () => {
  console.log('Server is running 🧟‍♂️');
});

/* 3️⃣ HTTP 클라이언트 생성, 요청 */
http.get(`http://localhost:${port}`, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
    console.log('data of res.on =====> ', data);
  });
  res.on('end', () => {
    try {
      console.log('end of res.on =====> ', data);
    } catch (err) {
      if (err) console.log(err);
    }
  });
});
