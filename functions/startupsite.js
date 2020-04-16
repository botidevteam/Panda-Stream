module.exports = {
    function() {
        const http = require('http');
        const options = new URL('http://www.youtube.com');

        const hostname = '127.0.0.1';
        const port = 3000;

        const server = http.createServer((req, res, socket) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            
        });
        const req = http.request(options, (res) => {
            
          });

        server.listen(port, hostname, () => {
            console.log(`Server listening http://${hostname}:${port}/`);
        });
    }
}
