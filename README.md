# Rest Api for Inventory using Express js and mysql

## Requirements:
```
    node v8
    mysql
    postman
```

## How to install:

1. Create a database using mysql named "inventory"
2. Check and Edit(if nessesary) the database config file (database_config.json) located at database folder
    - update the config file base on the configuration of your mysql eg. mysql username and password
3. Open command line and navigate to the project folder
4. run ``` node app.js ``` and wait for the app to start up
5. use postman to do api call on http://localhost:3000

## Rest API documentation
1. GET: /api/inventory
    - accepts and requires id as parameter
    - search on the model using id as search field

2. PUT: /api/inventory
    - accepts and requires name,qty,amount as parameters
    - create a new model using the provided parameters 
    - updates the model if the name is already existing

3. POST: /api/inventory
    - accepts and requires id as parameter
    - accepts (but optional) name,qty,amount as parameters
    - Update a new model using the provided paramters 

4. Delete: /api/inventory
    - accepts and requires id as parameter
    - Delete a new model using the provided id paramter

5. Get: /api/inventory/all
    - get all the saved Item models on the database
