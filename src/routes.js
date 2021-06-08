const express = require('express');

const Database = require('./Database');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.status(200);
});

routes.get('/municipios', Database.getAllCities);
routes.get('/produtos', Database.getAllProducts);
routes.post('/exportacao', Database.getBySH4);

module.exports = routes;