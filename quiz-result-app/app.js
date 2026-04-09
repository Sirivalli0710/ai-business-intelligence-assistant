const http = require('http');

http.createServer((req, res) => {
    res.end("Quiz Result Generated Successfully");
}).listen(4012);
