var express = require('express');
var app = express();
var port = 3000;

var user = express.Router();//creates new router object.
//router object is a collection of middleware and routes.
var student = express.Router();

user.get('/login', (req, res) => {
    console.log(req.baseUrl);
    res.send('bla bla bla');
    res.end();
});

student.get('/signup', (req, res, next) => {
    if (req.baseUrl === '/student') {
        console.log('Show signup form');
        res.send('Showing Signup Form');
        res.end();
    }
    else {
        console.log('Invalid Request recieved');//issue : not showing when the link text is changed.
        res.send('Invalid Request');
    }
});

app.use('/user', user);// mount specific middleware functions to specific path.
app.use('/student', student);

app.listen(port, (err) => {
    if (err) {
        console.log('Error Occured', err);
    }
    console.log('Server is Listening on PORT :', port);
});


//https://www.geeksforgeeks.org/express-js-req-baseurl-property/
//https://expressjs.com/en/api.html#req.baseUrl
