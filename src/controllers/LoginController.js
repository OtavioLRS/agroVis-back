const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../database/index.js');
const authConfig = require('../config/auth');

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

module.exports = {
  login(req, res) {
    const { email, password } = req.body;

    if (!email || !password || email == null || password == null || email == undefined || password == undefined)
      return res.status(400).json({ msg: 'EMAIL OR PASSWORD IS INVALID' });




    connection.query(`SELECT * FROM usuario WHERE email = ${email};`, (error, results) => {
      // if (results.length)
      console.log(results)

      // bcrypt.hash(password, 10, function (err, hash) {
      //   if (error !== null) console.log(error);
      //   // console.log(results);
      //   // res.send(results);
      // });
    });

  },

  signup(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password || email == null || password == null || email == undefined || password == undefined)
      return res.status(400).json({ msg: 'EMAIL OR PASSWORD IS INVALID' });

    bcrypt.hash(password, 10, function (err, hash) {
      let sql = 'INSERT INTO usuario (nome, email, senha) VALUES ?';
      let values = [[name, email, hash]];
      connection.query(sql, [values], function (err, results) {
        if (!err) return res.status(200);
        else return res.status(400).json({ msg: 'Email já cadastrado!' });
      })
    });
  }
}