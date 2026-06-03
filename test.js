const http = require('http');

const req = http.request('http://localhost:5205/api/contracts', { method: 'GET' }, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});
req.end();
