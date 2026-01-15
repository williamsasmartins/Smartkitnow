const fs = require('fs');
const data = process.argv[2];
fs.appendFileSync('raw_tools.txt', data + '\n');
console.log('Appended successfully');
