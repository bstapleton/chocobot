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
    getStats: function() {
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
            return row.total;
        });
    }
}
