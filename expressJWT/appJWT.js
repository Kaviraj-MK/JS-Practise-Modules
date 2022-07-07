const { ObjectID } = require('bson');
const express = require('express');
const app = express();
const mongoose = require('mongoose'); //import mongoose.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3000;
const url = 'mongodb://localhost:27017/school'; //connection URL
const jwtSecretKey = 'Secret#GGT';
const saltRounds = 10;

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
    userName: {
        type: String,
        required: true,
        unique: true //made username unique
    },
    password: {
        type: String,
        required: true
    },
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

//middleware of verification; Authorizartion token 
app.use((req, res, next) => {
    if (req.path !== '/profile' && req.path !== '/login') {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({
                error: 'Authorization token not found'
            });
        }
        return jwt.verify(token, jwtSecretKey, (err, decoded) => {
            console.log(token);
            if (err) {
                return res.status(401).json({
                    error: 'Unauthorized'
                });
            }
            next();
        });
    }
    next();
});

//to send JWTtokens in the response
//validate user and generate JWTtoken
app.post('/login', async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) {
        return res.status(400).json({
            status: 'Invalid Request'
        });
    }
    let data = {
        time: Date(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userId: 12,
    }
    const student = await students.findOne({ userName: userName }); //filter by username
    if (student) {
        const hashed = student.password; //load hashed password
        bcrypt.compare(password, hashed, (error, result) => {   //compare hashed password and login password
            if (error) {
                return res.status(500).json({
                    status: 'Error occured while verifying password.'
                });
            }
            if (result) {
                const token = jwt.sign(data, jwtSecretKey);
                return res.status(200).json({
                    token: token
                });
                //console.log(result);
            }
            else{
                return res.status(404).json({
                    status: 'Invalid Password'
                });
            }
        });
    }
    else {
        return res.status(404).json({
            status: 'Username Not Found.'
        });
    }
});

const students = mongoose.model('student', studentsSchema); //map the studentSchema to student collection

//filter data by searching ID
const filterById = async (id) => {
    return await students.findOne({ "_id": ObjectID(id) });
}

//Create Account
app.post('/profile', async (req, res) => {
    const userName = req.body.userName || '';
    const password = req.body.password || '';

    if (!userName || !password) {
        return res.status(400).json({
            status: 'invalid request format'
        });
    }
    const hashIt = async (password) => {
        const salt = await bcrypt.genSalt(saltRounds);
        console.log('salt is :', salt);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
    }

    //const hashedPw = await hashIt(password);

    console.log('Hashed password is: ', hashedPw);

    const name = req.body.name;
    const address = req.body.address;
    const age = req.body.age;
    const subjects = req.body.subjects;
    const studentData = {
        userName: userName,
        password: hashedPw,
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
    if (updatedStudent) {
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