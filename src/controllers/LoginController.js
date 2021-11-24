const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../database/index.js');
const authConfig = require('../config/auth');

const generateToken = (params = {}) => jwt.sign(params, authConfig.secret, {
  expiresIn: 86400, //um dia
});

const validPassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password || email == null || password == null || email == undefined || password == undefined)
      return res.status(400).json({ msg: 'Email ou senha inválido!' });

    connection.query(`SELECT * FROM usuario WHERE email = '${email}';`, (error, results) => {
      if (error !== null)
        return res.status(400).json({ msg: error });

      if (results.length == 0)
        return res.status(400).json({ msg: 'Usuário não cadastrado!' });

      const user = results[0];

      console.log(validPassword(password, user.password))

      if (validPassword(password, user.password) == false)
        return res.status(400).json({ msg: 'Senha incorreta!' });

      user.password = undefined;
      return res.send({ user, token: generateToken({ id: user.index }) })
    });
  },

  async signup(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password || email == null || password == null || email == undefined || password == undefined)
      return res.status(400).json({ msg: 'Email or password invalid' });

    connection.query(`SELECT * FROM usuario WHERE email = '${email}';`, (error, results) => {
      if (results.length != 0)
        return res.status(400).json({ msg: 'Email já cadastrado' })

      bcrypt.hash(password, 10, function (err, hash) {
        if (err) return res.status(400).json({ msg: 'Erro no cadastro' });

        let sql = 'INSERT INTO usuario (name, email, password) VALUES ?';
        let values = [[name, email, hash]];

        connection.query(sql, [values], function (errSql, results) {
          if (errSql) return res.status(400).json({ msg: 'Erro no cadastro' });

          results.password = undefined;
          res.send({
            message: 'Table Data',
            result: results,
            token: generateToken({ id: results.index })
          });
        })
      });
    });
  }
}