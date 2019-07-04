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

module.exports = class ApiEndpoints {
	static boostrap (app) {
		app.get(add_prefix('inventory'), get_inventory_data);
	}
};
