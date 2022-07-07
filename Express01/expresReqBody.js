//req.body - contains key pairs of data submitted in the request body.
const express = require('express');
const uuid = require('uuid'); //import uuid, uuid creates unique ids.
const app = express();
const port = 3000;

app.use(express.json()); //for parsing application/ json.
//parsing : the process of analzing a computer languages or data structures, conforming to the rules of a formal grammer.

app.use(express.urlencoded({
    extended: true
})); //for parsing application/x-www-from-urlencoded
//express.urlEncoded([option]) : return middleware that only urlencoded bodies.parses incoming requests with url encoded payloads(capacity of a packet or other transmission data unit).
//express.urlEncoded: only looks at requests where the content -type header matches the type option.

// creates students array to store students detials, sent from app.post()
let students = [];

//send response to ./user path, containing the data posted from app.post 
app.get('/users', (req, res, next) => {
    res.status(200).json(students);
    console.log('Students array list : ', students);    //show students array in console.
});


//get posted data, requested from ./profile path.
app.post('/profile', (req, res) => {
    const name = req.body.name; //request the name posted from ./profile
    const address = req.body.address; //request the address posted from ./profile
    const id = uuid.v4();   //auto generate via uuid plugin
    const student = {   //create json object 
        name: name, //assign keys ith values
        address: address,
        id: id
    };
    students.push(student); //push data in json object to studdents array.
    console.log(student);   //show the data of json object in console
    res.status(201).json(student);  //response is sent to ./profile path
});
 //show details when add id to url
app.get('/profile/:id', (req, res) => {
    const studentId = req.params.id;

    const student = students.find(student => {
        return (student.id === studentId);
    });

    res.status(200).json(student);
});

// flter student by ID
const filterStudent = ((inputId) => { 
    return students.find(student => {
        return (student.id === inputId);
    });
});

//update data sing app.put - app.put(path, (callback))
app.put('/profile/:id',(req, res) => {
    const ID = req.params.id;
    const filtrData = filterStudent(ID);
    const name = req.body.name;
    const address = req.body.address;
    filtrData.name = name;
    filtrData.address =address;
    const updatedStudent = {
        name: name,
        address: address,
        id: ID 
    }
    res.status(201).json(updatedStudent); // we use json instead of send to get output as a json object
});

app.delete('/profile/:id', (req, res) => {
    const ID = req.params.id;
    let filtrData = filterStudent(ID);
    if(filtrData){
        students = students.filter( student => student.id !== ID);
    }
    res.status(201).json({
        status: "delete"
    });
});

 //app.patch("path",callback) - make partial changes to an existing resources
app.patch("/profile/:id",(req,res) => {
    const id = req.params.id;
    const filterUser = filterStudent(id);
    const name = filterUser.name;
    const address = req.body.address;
    const patchedstudents = {
        name: name,
        address: address,
        id: id
    }
    res.status(201).json(patchedstudents);
});

//Show details when post the ID details as a request
// app.post('/idsearch',(req, res) => { //should make the path like this 
//     const studentId = req.body.id;      
//     const searchId = {                  //creating json object
//         id: studentId
//     };
//     const matchId = students.filter(key => {
//         return(key.id === searchId.id);
//     }
//     );
//     console.log(matchId);
//     res.status(201).json(matchId);
// });

app.listen(port, (err) => {
    if (err) {
        console.log('Error Occured : ', err);
    }
    console.log('Server listening on PORT : ', port);
})