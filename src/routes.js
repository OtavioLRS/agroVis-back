const express = require('express');

const Database = require('./controllers/DatabaseController');
const LoginController = require('./controllers/LoginController');

const authMiddleware = require('./middleware/auth')

const routes = express.Router();



routes.get('/municipios', Database.getAllCities);
routes.get('/produtos', Database.getAllProducts);
routes.post('/addnote', Database.addNote);
routes.post('/getnotes', Database.getNotes);
routes.post('/notes', Database.getNotes);
routes.post('/sh4conversion', Database.getSH4Conversion);

routes.post('/mapdata', Database.getMapData);
routes.post('/horizondata', Database.getHorizonData);
routes.post('/horizondata-aux', Database.getHorizonDataAux);
routes.post('/modaldata', Database.getModalData);







routes.post('/login', LoginController.login);
routes.post('/signup', LoginController.signup);
routes.get('/teste', authMiddleware, LoginController.signup);






module.exports = routes;