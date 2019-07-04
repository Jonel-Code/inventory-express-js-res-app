const PREFIX = '/api/';
function add_prefix (str = ''){
	return PREFIX + str;
}
module.exports = class ApiEndpoints {
	static boostrap (app) {
		app.get(add_prefix('home'), (req, res) => res.send('Welcome to express app'));
	}
};
