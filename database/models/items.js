const DbConnection = require('../dbConnection');

module.exports = class Items {
	static get _TABLE_SCHEMA () {
		return {
			name: 'items',
			columns: {
				id: 'int primary key auto_increment',
				name: 'varchar(255)not null',
				qty: 'int not null default 0',
				amount: 'int not null default 0',
			},
		};
	}

	static create_table () {
		const schema = this._TABLE_SCHEMA;
		const cols = schema.columns;
		const columns = Object.keys(cols)
			.map((key) => {
				const val = cols[key];
				return `${key} ${val}`;
			})
			.join(',');
		const create_query = `Create table if not exists ${schema.name}(
            ${columns}
        );`;
		DbConnection.execute(create_query, (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	static create_item (name, qty, amount) {
		const query = `INSERT INTO ${this._TABLE_SCHEMA.name}(name,qty,amount)
                        VALUES(?,?)`;
		const params = [
			name,
			qty,
			amount,
		];
		let inserted_id = undefined;
		try {
			DbConnection.execute(
				query,
				(err, result) => {
					if (err) {
						console.log(err);
					}
					inserted_id = result.insertId;
				},
				params,
			);
		} catch (err) {}
		// avoid zero false
		if (inserted_id || inserted_id >= 0) {
			return new Items(name, qty, amount, inserted_id);
		}
		else {
			return undefined;
		}
	}

	static async find_item (args = { name, qty, amount, id }) {
		const sql = `SELECT * FROM ${Items._TABLE_SCHEMA.name} `;
		console.log('args', args);
		let additional = ` where ${
			args.name != undefined ? ' name=? and ' :
			''}  ${
			args.qty != undefined ? ' qty=? and ' :
			''}  ${
			args.amount != undefined ? ' amount=? and ' :
			''}  ${
			args.id != undefined ? ' id=? ' :
			''} `;

		// trims the sql if it ends with "and" word
		const additional_array = additional.trim().split(' ');
		if (additional_array[additional_array.length - 1] == 'and') {
			additional_array.splice(additional_array.length - 1, 1);
			additional = additional_array.join(' ');
		}

		const params = [];
		if (args.name != undefined) {
			params.push(args.name);
		}
		if (args.qty != undefined) {
			params.push(args.qty);
		}
		if (args.amount != undefined) {
			params.push(args.amount);
		}
		if (args.id != undefined) {
			params.push(args.id);
		}

		try {
			const main_sql =
				sql +
				(
					Object.keys(args).length > 0 ? additional :
					'');

			return new Promise((resolve, reject) => {
				const results = [];
				DbConnection.execute(
					main_sql,
					(err, result) => {
						if (err) {
							console.log(err);
						}

						for (const value of result) {
							results.push(new Items(value.name, value.qty, value.amount, value.id));
						}
						resolve(results);
					},
					params,
				);
			});
		} catch (err) {
			return [];
		}
	}

	constructor (name, qty, amount, id = undefined) {
		this.name = name;
		this.qty = qty;
		this.amount = amount;
		this._id = id;
	}

	get id () {
		return this._id;
	}

	create_new () {
		return Items.create_item(this.name, this.qty, this.amount);
	}

	update () {
		if (!Number.isInteger(this.id)) {
			throw 'Error in id: if you are creating a new model please use create_new function';
		}
		const query = `UPDATE ${Items._TABLE_SCHEMA.name} 
                        SET 
                        name = ?,
                        qty = ?,
                        amount = ? 
                        where id = ${this.id}`;
		const params = [
			name,
			qty,
			amount,
		];
		let affected_rows = 0;
		try {
			DbConnection.execute(
				query,
				(err, result) => {
					if (err) {
						console.log(err);
					}
					affected_rows = result.affectedRows;
				},
				params,
			);
		} catch (err) {}
		// avoid zero false
		if (affected_rows <= 0) {
			return undefined;
		}
		else {
			return this;
		}
	}

	delete () {
		if (!Number.isInteger(this.id)) {
			throw 'Error in id: if you are creating a new model please use create_new function';
		}
		const query = `delte from ${Items._TABLE_SCHEMA.name} 
                        where id = ${this.id}`;
		let affected_rows = 0;
		try {
			DbConnection.execute(query, (err, result) => {
				if (err) {
					console.log(err);
				}
				affected_rows = result.affectedRows;
			});
		} catch (err) {}
		// avoid zero false
		if (affected_rows <= 0) {
			return false;
		}
		else {
			return true;
		}
	}
};
