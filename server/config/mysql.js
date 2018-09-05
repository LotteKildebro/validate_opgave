// hent mysql2 modulet
const mysql = require('mysql2');

// module.exports er den kode der muliggører `require()` 
// vi får det tilbage som modulet eksporterer
// i dette modul er det en funktion kaldet `connect`
module.exports = {
    connect: function () {
        // connect returnerer den aktive forbindelse som kommer ud af `createConnection`
        return mysql.createConnection({
            'host': 'localhost',
            'port': '3306',
            'user': 'root',
            'password': '', //husk password hvis SQL server kræver dette
            'database': 'validate'
        });
    }
};