const mysql = require('mysql');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tcc-db'
})

// const table = 'exportacao_sh4';
const table = 'exportacao_teste';

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

    if (cities.length != 0 || years.length != 0 || months.length != 0 || products.length != 0) {
      queryString = queryString.concat(' WHERE ');


      if (cities.length != 0) {
        queryString = queryString.concat('(');
        cities.forEach(e => {
          queryString = queryString.concat('CO_MUN = "' + e + '" OR ');
        });
        queryString = queryString.substring(0, queryString.length - 4).concat(') AND ');
      }

      if (years.length != 0) {
        queryString = queryString.concat('(');
        years.forEach(e => {
          queryString = queryString.concat('CO_ANO = ' + e + ' OR ');
        });
        queryString = queryString.substring(0, queryString.length - 4).concat(') AND ');
      }

      if (months.length != 0) {
        queryString = queryString.concat('(');
        months.forEach(e => {
          queryString = queryString.concat('CO_MES = ' + e + ' OR ');
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
      // console.log('\nDados brutos recebidos, realizando o tratamento...');
      // const data = structureExportData(results);
      // console.log('\nDados tratados, enviando...');
      // res.json(data);
    });
  },

}