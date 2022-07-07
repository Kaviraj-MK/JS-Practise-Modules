var express = require('express');
var app = express();
var port = 3000;

//req.app - This property holds a reference to the 
//instance of the Express application that is using the middleware.
app.get('/req.app', (req, res, next) => {
    console.log(req.app);
    //console.log(req.app_eventsCount);
    res.send('example for req.app :');
});

app.get('/req.appcount', (req, res, next) => {
    console.log(req.app._eventsCount);
    res.send('example for req.app_count');
})

//req.baseUrl

app.listen(port, (err) => {
    if(err){
        console.log('Error occured. : ', err);
    }
    console.log('server listening on PORT :', port);
});


