const mysql = require('mysql');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

const table = 'exportacao';

module.exports = {

  getCities(req, res) {
    connection.query('SELECT * FROM cidade;', (error, results, fields) => {
      if (error !== null) console.log(error);
      // console.log(results);
      console.log('Nomes dos municípios requisitados, enviando...');
      res.send(results);
    });
  },

  getProducts(req, res) {
    connection.query('SELECT * FROM sh4;', (error, results, fields) => {
      if (error !== null) console.log(error);
      // console.log(results);
      console.log('SH4s requisitados, enviando...');
      res.send(results);
    });
  },

  getByFilter(req, res) {
    let queryString = `SELECT * FROM ${table} `

    let { cities, years, months, products } = req.body.filter;

    if (cities.length != 0 || products.length != 0) {
      queryString = queryString.concat(' WHERE ');


      if (cities.length != 0) {
        queryString = queryString.concat('(');
        cities.forEach(e => {
          queryString = queryString.concat('CO_MUN = "' + e + '" OR ');
        });
        queryString = queryString.substring(0, queryString.length - 4).concat(') AND ');
      }

      if (products.length != 0) {
        queryString = queryString.concat('(');
        products.forEach(e => {
          queryString = queryString.concat('SH4 = ' + e + ' OR ');
        });
        queryString = queryString.substring(0, queryString.length - 4).concat(') AND ');
      }



      queryString = queryString.substring(0, queryString.length - 5);
    }
    queryString = queryString.concat(';');


    console.log('Requisição recebida! Executando query: \n  ' + queryString);

    // Enviando query ao banco
    connection.query(queryString, (error, results, fields) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

}