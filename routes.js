const express = require('express');


const Database = require('./Database');

const routes = express.Router();


routes.get('/municipios', Database.getCities);
routes.get('/produtos', Database.getProducts);
routes.post('/exportacao', Database.getByFilter);

module.exports = routes;