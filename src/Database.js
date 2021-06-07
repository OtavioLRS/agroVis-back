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
    let query = `SELECT * FROM ${table} WHERE `

    let { cities, products, beginPeriod, endPeriod } = req.body.filter;

    // Periodo de tempo
    const beginYear = parseInt(beginPeriod.split('-')[0]);
    const beginMonth = parseInt(beginPeriod.split('-')[1]);

    const endYear = parseInt(endPeriod.split('-')[0]);
    const endMonth = parseInt(endPeriod.split('-')[1]);

    query += `((CO_ANO > ${beginYear} AND CO_ANO < ${endYear}) OR ` // Anos 
    query += `(CO_ANO = ${beginYear} AND CO_MES >= ${beginMonth}) OR `
    query += `(CO_ANO = ${endYear} AND CO_MES <= ${endMonth})) AND `

    // Cidades
    if (cities.length != 0) {
      query += '(';
      cities.forEach(e => {
        query += `CO_MUN = ${e} OR `;
      });
      query = query.substring(0, query.length - 4) + ') AND ';
    }

    // SH4s
    if (products.length != 0) {
      query = query.concat('(');
      products.forEach(e => {
        query += `SH4 = ${e} OR `;
      });
      query = query.substring(0, query.length - 4) + ') AND ';
    }
    query = query.substring(0, query.length - 5) + ';'

    console.log('Requisição recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results, fields) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

}