const fs = require('fs');
const path = require('path');
//fs.readdir(path, options, callbackfunction);
//fs.readdr(path, withFileTypes, (err,files) => {});
fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('\n Current directory filenames :');
        files.forEach(file => {
            console.log(file);
        });
    }
});

console.log('   ');

const fileextPromise = new Promise((resolve) => {
    resolve(fs.readdir(__dirname,
        { withFileTypes: true },
        (err, files) => {
            console.log('/nCurrent directory files:');
            if (err) {
                console.log(err);
            }
            else {
                files.forEach(file => {
                    console.log(file);
                });
            }
        }
    ));
});
fileextPromise.then(() => {
    //return filenames with the .txt extension only.
    fs.readdir(__dirname, (err, files) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('/Filenames with the .txt extension');
            files.forEach(file => {
                if (path.extname(file) === '.txt')
                    console.log(file);
            });
        }
    })

});
//fs.readdir(path, (option), callback);
//fs.readdir(path, {withFileType}, (err, files){});

//readFileSync(path, option); 
//readFileSync(path, {encoding : , flag :});   

const data = fs.readFileSync('./links.txt', {
    encoding: 'utf-8',
    flag: 'r'
});
console.log('Included data is :', data);
//stops all other processes and do the readFileSync stuff


//fs.writeFile()

let contdata = "Apple, Orrange are banned here";

fs.writeFile('fruits.txt', contdata, (err) => {
    if (err) {
        console.log('Error Occured: ', err);
    }
    else {
        console.log('File Written Successfully');
        console.log('File Contents are following data.');
        console.log(fs.readFileSync('fruits.txt', {
            encoding: 'utf-8',
            flag: 'r'
        }));

    }
});


//fs.mkdir(path, option, callback);

fs.mkdir(path.join(__dirname, 'test'), (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Directly created successfully!');
});

//when recursive occured
//check this. not working
fs.mkdir(path.join(__dirname, 'test'),
    {
        recursive: true
    },
    (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Directory created successfully!');
    });


    //fs.existsSync()

//fs.existsSync(path)

let fileExist = fs.existsSync('fruits.txt');
console.log('fruits.txt exists status : ', fileExist);

fileExist = fs.existsSync('world.txt');
console.log('world.txt exists status : ', fileExist);

//fs.createReadStream(path, options);
//fs.createReadStream(path, {falg: , encoding: , start: , end: , highWaterMark: });

reader = fs.createReadStream('fruits.txt');

reader.on('data', function(chunk){
    console.log('createReadStream function executes : ' ,chunk.toString());
});


reader = fs.createReadStream('fruits.txt', {
    flag : 'a+',
    encoding : 'utf-8',
    start : 5 ,
    end : 20,
    highWaterMark : 10
});

reader.on('data', (chunk) => {
    console.log(chunk);
});

//fs.createWriteStream(path, option);

fs.createWriteStream('createWrite.txt')