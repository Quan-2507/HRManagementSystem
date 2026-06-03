const http = require('http');

const data = JSON.stringify({ email: 'admin@hrmanagement.com', password: 'admin123' });
const loginReq = http.request('http://localhost:5205/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let cookie = res.headers['set-cookie'];
  if (Array.isArray(cookie)) cookie = cookie.join(';');
  
  const req2 = http.request('http://localhost:5205/api/contracts', {
    method: 'GET',
    headers: { 'Cookie': cookie }
  }, (res2) => {
    console.log('Contracts Status:', res2.statusCode);
    res2.on('data', d => process.stdout.write(d));
  });
  req2.end();
});
loginReq.write(data);
loginReq.end();
