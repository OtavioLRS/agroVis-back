const mysql = require('mysql');
const { buildWhereClause } = require('./extra');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

const table = 'exportacao';

module.exports = {

  getAllCities(req, res) {
    connection.query('SELECT * FROM cidade;', (error, results) => {
      if (error !== null) console.log(error);
      // console.log(results);
      console.log('Nomes dos municípios requisitados, enviando...');
      res.send(results);
    });
  },

  getAllProducts(req, res) {
    connection.query('SELECT * FROM sh4;', (error, results) => {
      if (error !== null) console.log(error);
      // console.log(results);
      console.log('SH4s requisitados, enviando...');
      res.send(results);
    });
  },

  getBySH4(req, res) {
    // Inicio
    let query = `SELECT CO_ANO, CO_MES, SH4, NO_SH4_POR, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    // Data, Cidades, SH4s
    query += buildWhereClause(req.body.filter);

    // Agrupar valores de mesma data e SH4
    query += ' GROUP BY SH4, CO_ANO, CO_MES;'

    console.log('Requisição recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getByCity(req, res) {
    // Inicio
    let query = `SELECT CO_MUN, NO_MUN_MIN, SH4, NO_SH4_POR, COUNT(*) AS NUMBER_REGS, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    // Data, Cidades, SH4s
    query += buildWhereClause(req.body.filter);

    // Agrupar valores de mesma data e SH4
    query += ' GROUP BY CO_MUN, SH4 ORDER BY CO_MUN;'

    console.log('Requisição recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },
}