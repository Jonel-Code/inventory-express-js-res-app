const items = require('./database/models/items');

const PREFIX = '/api/';
function add_prefix (str = ''){
	return PREFIX + str;
}

const get_inventory_data = function (req, res){
	const params = req.query;
	items
		.find_item({ name: params.name, qty: params.qty, amount: params.amount, id: params.id })
		.then((result = []) => {
			res.send(
				result.map((x) => {
					return x.to_json;
				}),
			);
		});
};

const get_all_inventory_data = function (req, res){
	items.get_all_items().then((result = []) => {
		res.send(
			result.map((x) => {
				return x.to_json;
			}),
		);
	});
};

const post_inventory_data = function (req, res){
	const params = req.query;
	if (params.id == undefined) {
		res.status(409).send({ message: 'id parameter is required' });
	}
	else {
		items.find_item({ id: params.id }).then((result = []) => {
			if (result.length == 0) {
				res.status(404).send({
					message: 'Data to update not found',
				});
			}
			else {
				try {
					for (const item of result) {
						// name: params.name, qty: params.qty, amount: params.amount,
						if (params.name != undefined) {
							item.name = params.name;
						}
						if (params.qty != undefined) {
							item.qty = Number(params.qty);
						}
						if (params.amount != undefined) {
							item.amount = Number(params.amount);
						}
						item.update();
					}
					res.send(
						result.map((x) => {
							return x.to_json;
						}),
					);
				} catch (err) {
					res.status(500).send({ message: 'there is an Error upon updating model' });
				}
			}
		});
	}

	// res.send({
	// 	json: 'some json response',
	// });
};

const put_inventory_data = function (req, res){
	const params = req.query;
	console.log('params', params);
	if (
		params.name === undefined ||
		params.qty === undefined ||
		params.amount === undefined ||
		!Number.isInteger(Number(params.amount)) ||
		!Number.isInteger(Number(params.qty))
	) {
		res.status(500).send({ message: 'unfulfilled parameter requirements' });
	}
	else {
		items.create_item(params.name, Number(params.qty), Number(params.amount));
		res.send({
			message: 'created',
		});
	}
};

const delete_inventory_data = function (req, res){
	const params = req.query;
	if (params.id == undefined || !Number.isInteger(Number(params.id))) {
		res.status(409).send({ message: 'id parameter is required' });
	}
	else {
		items
			.find_item({ id: Number(params.id) })
			.then((result = []) => {
				console.log('result', result);
				for (const item of result) {
					item.delete();
				}
				res.send({ message: 'deleted' });
			})
			.catch((x) => {
				res.send({
					message: 'error in deleting data',
				});
			});
	}
};

module.exports = class ApiEndpoints {
	static boostrap (app) {
		app.get(add_prefix('inventory'), get_inventory_data);
		app.post(add_prefix('inventory'), post_inventory_data);
		app.put(add_prefix('inventory'), put_inventory_data);
		app.delete(add_prefix('inventory'), delete_inventory_data);
		app.get(add_prefix('inventory/all'), get_all_inventory_data);
	}
};
