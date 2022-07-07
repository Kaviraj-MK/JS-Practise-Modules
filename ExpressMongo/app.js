//req.body - contains key pairs of data submitted in the request body.
const express = require('express' );
const app = express();
const { MongoClient, ObjectId } = require('mongodb'); //import {MongoClient} from 'mongodb'
const port = 3000;

const url = 'mongodb://localhost:27017'; //connection URL
const client = new MongoClient(url); //define Mongo service
const dbName = 'school';    //Database name
let db = null;
let collection = null;

const connect = async () => {   // connect to database: "school"
    try {   //error handling    
        await client.connect(); 
        db = client.db(dbName);
        collection = db.collection('students'); //connect to collection
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error Occured in MongoDB", error);
    }
}
(async () => {
    await connect();
})();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

//let students = [];
// app.get('/test', (req, res, next) => {
//     const data = req.header('my-custom');
//     console.log(data);
//     res.status(200).send({"Data": "Success"});
// });



app.get('/users', async (req, res, next) => {
    const students = await collection.find({}).toArray();
    console.log(students);
    //students = await collection.find({});
    res.status(200).json(students);
    console.log('Students array list : ', students);
});

app.post('/profile', async (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const subjects = req.body.subjects;
    const age = req.body.age;
    const createStudentData = {
        name: name,
        address: address,
        subjects: subjects,
        age: age
    }
    await collection.insertOne(createStudentData);

    console.log(createStudentData);
    res.status(201).json(createStudentData);
});

app.get('/profile/:id', async (req, res) => {
    const studentId = req.params.id;
    const student = await filterStudent(studentId);

    res.status(200).json(student);
    console.log("Searched data: ", student);
});

const filterStudent = async (studentId) => {
    return await collection.findOne({"_id": ObjectId(studentId)});
};

app.put('/profile/:id',async (req, res) => {
    const ID = req.params.id;
    const name = req.body.name;
    const address = req.body.address;
    const age = req.body.age;
    const subjects = req.body.subjects;
    const studentData = {
        name: name,
        address: address,
        age: age,
        subjects: subjects
    }
    const updateStudent = await collection.findOneAndUpdate( {"_id": ObjectId(ID)}, {$set: studentData}, {returnDocument: "after"} );
    res.status(201).json(updateStudent.value); //
});

app.delete('/profile/:id',async (req, res) => {
    const ID = req.params.id;
    //let filtrData = await filterStudent(ID);
    const deletedStudent = await collection.findOneAndDelete( { "_id": ObjectId(ID) }, { returnDocument: "after"} );
    res.status(200).json(deletedStudent.value);
});

app.patch("/profile/:id", async (req, res) => {
    const id = req.params.id;
    const filterUser =await filterStudent(id);
    const name = req.body.name || filterUser.name;
    const address = req.body.address || filterUser.address;
    const subjects = req.body.subjects || filterUser.subjects;
    const age = req.body.age || filterUser.age;
    const patchedstudents = {
        name: name,
        address: address,
        subjects: subjects,
        age: age
    }
    const updateStudent = await collection.findOneAndUpdate( { "_id": ObjectId(id)}, { $set: patchedstudents}, {returnDocument: "after" } );
    res.status(201).json(updateStudent.value);
});

//query parameter
app.get( '/profileByName', async ( req, res ) => {
    const studentName = req.query.name;
    const student = await collection.findOne({ "name": studentName });


    res.status(200).json(student);
    console.log(student);
});     

app.listen(port, (err) => {
    if (err) {
        console.log('Error Occured : ', err);
    }
    console.log('Server listening on PORT : ', port);
})