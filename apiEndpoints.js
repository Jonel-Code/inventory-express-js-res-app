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

const post_inventory_data = function (req, res){
	const params = req.query;

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

	// res.send({
	// 	json: 'some json response',
	// });
};

module.exports = class ApiEndpoints {
	static boostrap (app) {
		app.get(add_prefix('inventory'), get_inventory_data);
		app.post(add_prefix('inventory'), post_inventory_data);
	}
};
