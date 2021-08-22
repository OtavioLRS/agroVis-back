const mysql = require('mysql');
const { buildWhereClause } = require('./extra');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

const table = 'exportacao_miltown';
// const table = 'exportacao_final';

module.exports = {

  getAllCities(req, res) {
    connection.query('SELECT * FROM cidade ORDER BY NO_MUN_MIN asc;', (error, results) => {
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

  getMapData(req, res) {
    // Inicio
    let query = `SELECT CO_MUN, NO_MUN_MIN, SH4, NO_SH4_POR, COUNT(*) AS NUMBER_REGS, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    // Data, Cidades, SH4s
    query += buildWhereClause(req.body.filter);

    // Agrupar valores de mesma data e SH4
    query += 'AND VL_FOB != 0 GROUP BY CO_MUN, SH4 ORDER BY VL_FOB asc;'

    console.log('Requisição de dados Map recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getHorizonData(req, res) {
    // Inicio
    let query = `SELECT CO_ANO, CO_MES, SH4, NO_SH4_POR, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    // Data, Cidades, SH4s
    query += buildWhereClause(req.body.filter);

    // Agrupar valores de mesma data e SH4
    query += 'GROUP BY SH4, CO_ANO, CO_MES;'

    console.log('Requisição de dados Horizon recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getHorizonDataAux(req, res) {
    // Inicio
    let query = `SELECT CO_ANO, CO_MES, SH4, NO_SH4_POR, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    // Cidade 'fantasma' com os dados auxiliares
    req.body.filter.cities = ['0000000'];

    // Data, Cidades, SH4s
    query += buildWhereClause(req.body.filter);

    // Agrupar valores de mesma data e SH4
    query += 'GROUP BY SH4, CO_ANO, CO_MES;'

    console.log('Requisição de dados auxiliares recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getSH4Conversion(req, res) {
    // Inicio
    let query = `SELECT * FROM sh4_ncm WHERE CO_SH4 = ${req.body.sh4};`

    console.log('Requisição de conversão de SH4 recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getModalData(req, res) {
    // Inicio
    let query = `SELECT CO_MUN, NO_MUN_MIN, SH4, NO_SH4_POR, SUM(KG_LIQUIDO) AS KG_LIQUIDO, SUM(VL_FOB) AS VL_FOB FROM ${table} `

    query += buildWhereClause(req.body.filter);

    query += 'AND VL_FOB != 0 GROUP BY CO_MUN ORDER BY VL_FOB desc;'

    console.log('Requisição de dados do Modal recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getNumRegs(req, res) {
    // Inicio
    let query = `SELECT CO_ANO, CO_MES, COUNT(*) AS NUM_REG FROM ${table} `

    query += buildWhereClause(req.body);

    query += 'GROUP BY CO_MES;'

    // console.log('Requisição de numero de registros recebida! Executando query: \n  ' + query);

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      // console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  getNotes(req, res) {
    let query = `SELECT * FROM anotacao;`

    // Enviando query ao banco
    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nDados recebidos, enviando...');
      res.send(results);
    });
  },

  addNote(req, res) {
    const { filter, map, note, now } = req.body;
    console.log({ filter, map, note, now })

    let query = `INSERT INTO anotacao (` +
      `PRODUCTS,` +
      `CITIES,` +
      `BEGIN_PERIOD,` +
      `END_PERIOD,` +
      `SORT_VALUE,` +
      `MAP_SH4,` +
      `NUM_CLASS,` +
      `TITLE,` +
      `TEXTO,` +
      `REGISTER_DATE) VALUES ` +
      `('${filter.products}',` +
      `'${filter.cities}',` +
      `'${filter.beginPeriod}',` +
      `'${filter.endPeriod}',` +
      `'${filter.sortValue}',` +
      `${map.sh4},` +
      `${map.numClasses},` +
      `'${note.title}',` +
      `'${note.text}',` +
      `TIMESTAMP('${now}'));`

    console.log("Inserindo nota: " + query);

    connection.query(query, (error, results) => {
      if (error !== null) console.log(error);
      console.log('\nAnotação salva!');
      res.send(results);
    });
  }
}