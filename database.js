'use strict';
import sqlite3 from 'sqlite3';
import { open, close } from 'sqlite';
const db = new sqlite3.Database('./tmp/database.db');

let statsObject = {};
module.exports = {
    init: function() {
        db.run('CREATE TABLE IF NOT EXISTS rolls(user_id, sides, result)');
    },
    openConnection: function() {
        open({
            filename: './tmp/database.db',
            driver: sqlite3.Database
        }).catch(error => console.error(error));
    },
    closeConnection: function() {
        return new Promise((resolve, reject) => {
            db.close();
        });
    },
    insertRoll: function(user_id, sides, result) {
        db.run(
            `INSERT INTO rolls (user_id, sides, result) VALUES (${user_id}, ${sides}, ${result})`
        );
    },
    getTotal: function() {
        return new Promise((resolve, reject) => {
            db.get('SELECT COUNT(result) as total FROM rolls', function(err, row) {
                if (err) {
                    reject(console.error(err));
                } else {
                    statsObject.total = row.total;
                    resolve(statsObject);
                }
            });
        });
    },
    getProfile: function(user_id) {
        // TODO
    },
    getTotalRolls: function() {
        this.openConnection();
        return new Promise((resolve, reject) => {
            db.get('SELECT COUNT(result) as total FROM rolls', function(err, row) {
                if (err) {
                    reject(console.error(err));
                } else {
                    resolve(row);
                }
            });
        }).then(row => {
            statsObject.total = row.total;
        }).then(() => {
            return statsObject;
        });
    },
    getDiceTotals: function(allowedDice) {
        this.openConnection();
        statsObject.rows = [];
        allowedDice.map((die) => {
            return new Promise((resolve, reject) => {
                db.get(`SELECT COUNT(result) as total, sides FROM rolls WHERE sides = ${die}`, function(error,row) {
                    if (row.total > 0) {
                        console.log(row, 'this is the row');
                        resolve(row);
                    }
                });

            }).then(row => {
                statsObject.rows.push(row);
            // }).then(() => {
            //     //console.log(statsObject, 'this is the object at the end');
            //     return statsObject;
            })
        });
    },
    getStats: function(allowedDice) {
        return this.getDiceTotals(allowedDice);


        return new Promise((resolve, reject) => {
            return this.getTotalRolls();
        }).then(() => {
            return this.getDiceTotals(allowedDice);
        }).then(() => {
            console.log(statsObject);
            return statsObject;
        });
        // return this.getDiceTotals(allowedDice);
        // this.openConnection();
        // return new Promise((resolve, reject) => {
        //     db.get('SELECT COUNT(result) as total FROM rolls', function(err, row) {
        //         if (err) {
        //             reject(console.error(err));
        //         } else {
        //             resolve(row);
        //         }
        //     });
        // }).then(row => {
        //     console.log(row);
        //     statsObject.total = row.total;
        // }).then((resolve, reject) => {
        //     db.get('SELECT COUNT(result) as total FROM rolls WHERE sides = 6', function (err, row) {
        //         if (err) {
        //             reject(console.error(err));
        //         } else {
        //             resolve(row);
        //         }
        //     });
        // }).then((row) => {
        //     statsObject.six = row.total;
        // }).then(() => {
        //     return statsObject;
        // });
    }
}
