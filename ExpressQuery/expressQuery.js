const express = require( 'express' );
const app = express();
const { MongoClient, ObjectId} = require ( 'mongodb' );
var PORT = 3000;

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'school';
let db = null;
let collection = null;

const connect = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        collection = db.collection( 'students' );
        console.log("Connected to MongoDB");
    }
    catch(error){
        console.log("Error occured in MongoDb : ", error);
    }
}

(async () => {
    await connect();
})();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get( '/query', ( req, res ) => {
    const queryStudent = req.query;
    res.status(200).json(queryStudent);
    console.log(queryStudent);
});

app.listen(PORT, (err) => {
    if(err){
        console,log(err);
    }
    else{
        console.log('app is listening to PORT : ', PORT)
    }
});
