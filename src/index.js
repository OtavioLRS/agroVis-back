require('dotenv').config()

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const server = express();

server.use(express.json());
server.use(cors());
server.use(routes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor inicializado na porta ${PORT}`);
  console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_NAME,
    password: process.env.DB_USER,
    database: process.env.DB_PASS
  })
});