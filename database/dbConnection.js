'use strict';

const db_config = require('./database_config.json');
const mysql = require('mysql');
const connection = mysql.createPool({ ...db_config, connectionLimit: 100 });

const getConnection = function (callback){
	connection.getConnection(function (err, connection){
		callback(err, connection);
	});
};

module.exports = class DbConnection {
	static execute (sql = '', callback = (err, rows, fields) => {}, params = []) {
		getConnection((error, connection) => {
			try {
				console.log('execute query: ', sql);
				connection.query(sql, params, callback);
			} catch (err) {
				throw 'Error in Query\n';
			} finally {
				if (error) {
					console.log('error', error);
				}
				// connection.end();
				connection.release();
			}
		});
	}
};
