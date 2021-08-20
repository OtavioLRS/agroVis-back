const express = require('express');

const Database = require('./Database');

const routes = express.Router();

routes.get('/municipios', Database.getAllCities);
routes.get('/produtos', Database.getAllProducts);

routes.post('/mapdata', Database.getMapData);

routes.post('/horizondata', Database.getHorizonData);
routes.post('/horizondata-aux', Database.getHorizonDataAux);

routes.post('/modaldata', Database.getModalData);
routes.post('/sh4conversion', Database.getSH4Conversion);
routes.post('/notes', Database.getNotes);

routes.post('/addnote', Database.addNote);

routes.post('/num-regs', Database.getNumRegs);


module.exports = routes;