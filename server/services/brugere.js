const mysql = require('../config/mysql.js');

module.exports = {
    hent_alle: () => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT 
            bruger_id, 
            bruger_email
            FROM brugere 
            ORDER by bruger_email ASC`,
                [], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },
    hent_en: (bruger_id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT
            bruger_id, 
            bruger_email
            FROM brugere
            WHERE bruger_id = ?`,
                [bruger_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        resolve(rows[0]);
                    }
                });
            db.end();
        });
    },
    opret_en: (email, kodeord) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO brugere SET
             bruger_email = ?,
             bruger_kode = ?`,
                [email, kodeord], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },


    ret_en: (email, kodeord, bruger_id) => {
        return new Promise((resolve, reject) => {
            let sqlquery = `UPDATE brugere SET bruger_email=?`
            let params = [bruger_email];
            if (bruger_kodeord != "") {
                sqlquery += `, bruger_kodeord=?`;
                params.push(kodeord);
            }
            sqlquery += ` WHERE bruger_id=?`
            params.push(bruger_id);
            let db = mysql.connect();
            db.execute(sqlquery, params, (err, rows) => {
                if (err) {
                    console.log(err.message); //hvis der er fejl
                    reject(err.message);
                } else {
                    console.log(rows);
                    resolve(rows); //hvis der ikke er nogen fejl
                }
            });
            db.end();

        });
    },
    slet_en: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`DELETE FROM brugere 
            WHERE bruger_id = ? `,
                [id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        })
    },


    find_uniq: (bruger_email) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT COUNT(*) AS antal
                        FROM brugere
                        WHERE bruger_email = ?`,
                [bruger_email], (err, rows) => {
                    if (err) {

                        console.log(err.message);
                        reject(err.message);

                    } else {

                        let ikke_findes = rows[0].antal == 0;

                        resolve(ikke_findes);
                    }
                });
            db.end();
        });
    },

}