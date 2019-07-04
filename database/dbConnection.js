'use strict';

const db_config = require('./database_config.json');
const mysql = require('mysql');
const connection = mysql.createConnection(db_config);

module.exports = class DbConnection {
	static execute (sql = '', callback = (err, rows, fields) => {}) {
		connection.connect((err) => {
			if (!err) {
				console.log('connection established');
			}
			else {
				console.log(err);
			}
		});
		try {
			console.log('execute query: ', sql);
			connection.query(sql, callback);
		} catch (err) {
			throw 'Error in Query\n';
		} finally {
			connection.end();
		}
	}
};
