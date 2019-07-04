const express = require('express');
const app = express();
const port = 3000;

const items = require('./database/models/items');
items.create_table();

const apiEndpoints = require('./apiEndpoints');
apiEndpoints.boostrap(app);

app.get('/', (req, res) => res.send('Welcome to express app'));

app.listen(port, () => console.log(`Express app listening on port ${port}!`));
