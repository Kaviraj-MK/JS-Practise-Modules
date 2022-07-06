const http = require('http');
const fs = require('fs');
const path = require('path');


const port = 3000;
const hostName = '127.0.0.1';

const getMimeType = (filePath) => {
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        'jpg' : 'image/jpg'
    };
    return mimeTypes[extname] || 'application/octet-stream';
}

/*const server = http.createServer((req, res) => {
    fs.readFile('Test1.html', (err, data) => {
        if (err) {
            console.error(err);
            res.end({ 'error': 'Error Occured.' });
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, 'utf-8');
    });
});*/
const preparePath = (url) => {
    let filePath = '.' + url;
    if (filePath == './') {
        filePath = './Test1.html';
    }
    return filePath;
}

const server = http.createServer((req, res) => {

    const filePath = preparePath(req.url);
    if(filePath === './favicon.ico') {
        return;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error Server: ', err);
            res.writeHead(404);
            res.end({ 'error': 'Error Occured.' });
        }
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(data, 'utf-8');
    });
});

// const contentType = getMimeType(filePath);
// fs.readFile(filePath, function(error, content) {
//     if (error) {
//         if(error.code == 'ENOENT') {
//             fs.readFile('./404.html', function(error, content) {
//                 res.writeHead(404, { 'Content-Type': 'text/html' });
//                 res.end(content, 'utf-8');
//             });
//         }
//         else {
//             res.writeHead(500);
//             res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
//         }
//     }
//     else {
//         console.log('file path', filePath);
//         res.writeHead(200, { 'Content-Type': contentType });
//         res.end(content, 'utf-8');
//     }
// });.

server.listen(port, hostName, () => {
    console.log(`Server2 runninng at http://${hostName}:${port}/`);
}); 