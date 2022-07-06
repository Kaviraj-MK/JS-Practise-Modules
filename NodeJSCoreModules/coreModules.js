const path = require('path');
console.log('dirname : ', __dirname);

console.log('filename : ', __filename);

console.log(path.isAbsolute('C:\\foo\\..'));

console.log(path.parse('/home/user/dir/file.txt'));
