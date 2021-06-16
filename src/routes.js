const express = require('express');

const Database = require('./Database');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.status(200);
});

routes.get('/municipios', Database.getAllCities);
routes.get('/produtos', Database.getAllProducts);
routes.post('/horizon_query', Database.getBySH4);
routes.post('/map_query', Database.getByCity);

module.exports = routes;