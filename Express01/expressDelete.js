var express = require('express');
var app = express();
var port = 4000;

app.delete('/delete', (req, res) => {
    res.send('delete success');
});

app.listen(port, (err) => {
    if(err){
        console.log('error occured : ', err);
    }
    console.log('Server listening to PORT : ', port);
});