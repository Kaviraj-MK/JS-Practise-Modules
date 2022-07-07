const { ObjectID } = require('bson');
const express = require('express');
const app = express();

const mongoose = require('mongoose'); //import mongoose
const port = 3000;
const url = 'mongodb://localhost:27017/school'; //connection URL

const connect = async () => {
    try {
        await mongoose.connect(url);
    }
    catch (error) {
        console.log("Error occured connecting mongoose :", error);
    }
}

(async () => {
    await connect();
})();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const studentsSchema = new mongoose.Schema({ //schema
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    subjects: {
        type: [String],
        required: true
    }
});

const students = mongoose.model('student', studentsSchema); //map the studentSchema to student collection

const filterById = async (id) => { //filter data by searching ID
    return await students.findOne({ "_id": ObjectID(id) });
}

app.post('/profile', async (req, res) => {
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
    const student = new students(studentData);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
});

app.patch('/profile/:id', async (req, res) => {
    const id = req.params.id;
    const filterUser = await filterById(id);
    const name = req.body.name || filterUser.name;
    const address = req.body.address || filterUser.address;
    const age = req.body.age || filterUser.age;
    const subjects = req.body.subjects;
    const studentData = {
        name: name,
        address: address,
        age: age,
        subjects: subjects
    }

    const patchedStudent = await students.findOneAndUpdate({ "_id": id }, { $set: studentData }, { returnDocument: "after" });
    res.status(204).json(patchedStudent);

});

app.get('/profile/:id', async (req, res) => {
    const id = req.params.id;
    const searchedSudent = await filterById(id);
    res.status(200).json(searchedSudent);
});

//update data - if searched ID is not found, create data to entered ID.
app.put('/profile/:id', async (req, res) => {
    const id = req.params.id;
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
    const updatedStudent = await students.findOneAndUpdate({ "_id": id }, { $set: studentData }, { returnDocument: "after" });
    if ( updatedStudent ) {
       return res.status(204).send();
    }
    studentData._id = id;
    const student = new students(studentData);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent); //as a standard, neither put nor patch responds are not sent.
});

app.delete('/profile/:id', async (req, res) => {
    const id = req.params.id;
    const deletedStudent = await students.findOneAndDelete({ "_id": id }, { returnDocument: "after" });
    res.status(200).json(deletedStudent.value);
});

//query parameter
app.get('/profileByName', async (req, res) => {
    const name = req.query.name;
    const queryStudent = await students.findOne({ "name": name });
    res.status(200).json(queryStudent);
});

app.get('/users', async (req, res) => {
    const studentList = await students.find({});
    res.status(200).json(studentList);
    console.log(studentList);
});

app.listen(port, (err) => {
    if (err) {
        console.log("Error Occured : ", err);
    }
    else {
        console.log("server is listening to port: ", port);
    }
});