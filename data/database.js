const database = require('mysql2/promise');

const pool = database.createPool({
    host : 'localhost',
    database : 'blog',
    user : 'root',
    password : 'rickdairyll1921',
})
module.exports = pool;