const express = require('express');

const Database = require('./Database');

const routes = express.Router();

routes.get('/municipios', Database.getAllCities);
routes.get('/produtos', Database.getAllProducts);
routes.post('/horizondata', Database.getHorizonData);
routes.post('/mapdata', Database.getMapData);
routes.post('/horizondata-aux', Database.getHorizonDataAux);
routes.post('/sh4conversion', Database.getHorizonModal);

module.exports = routes;