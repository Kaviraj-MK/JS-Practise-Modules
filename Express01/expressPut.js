//app.put(path,callback[callback]); - The PUT method requests 
const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

let userArr = [];

app.post('/user', (req, res) => {
    const name = req.body.name;
    const userName = {
        name: name
    }
    userArr.push(userName);
    res.status(201).json(userArr);
});

app.put('/user',(req, res) => {
    
    userArr.name ===  'Dean';
    res.status(201).json(userArr);
});

app.get('/details', (req, res) => {

});
app.listen(PORT, (err) => {
    if(err){
        console.log('error occured : ', err);
    }
    console.log('server listening to PORT : ',PORT);
});