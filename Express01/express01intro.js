var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.send('Express 01 Intro program');
});

app.get('/hello', (req, res, next) => {
    res.send('getting "hello" request');
});

var server = app.listen(8000, (err) => {
    if (err) {
        console.log('error occured. : ', err);
    }
    var host = server.address().address;
    var port = server.address.port;
    console.log('Example app is listening at http://%s:s', host, port);
});