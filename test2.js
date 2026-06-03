const http = require('http');

const req = http.request('http://localhost:5205/api/employees', { method: 'GET' }, (res) => {
  console.log('Employees Status:', res.statusCode);
});
req.end();
