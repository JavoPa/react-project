const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userController = require('../controllers/userController');
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = require('../config/env');

exports.register = function(req, res, next) {
  const { username, password } = req.body;

  userController.findUserByName(username)
    .then(user => {
      if (user) {
        return res.status(400).send({ message: 'El nombre de usuario ya está en uso' });
      } else {
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) {
            return next(err);
          }

          userController.createUser(username, hash)
            .then(user => {
              const token = jwt.sign({ id: user.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });
              const refreshToken = jwt.sign({ id: user.id }, REFRESH_JWT_SECRET, { expiresIn: '7d' });
              res.send({ message: 'Usuario registrado con éxito', token, refreshToken });
            })
            .catch(err => next(err));
        });
      }
    })
    .catch(err => next(err));
};

exports.login = function(req, res, next) {
  const { username, password } = req.body;

  userController.findUserByName(username)
    .then(user => {
      if (!user) {
        return res.status(400).send({ message: 'No se encontró ningún usuario con ese nombre' });
      }

      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
          return next(err);
        }

        if (!isMatch) {
          return res.status(400).send({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, REFRESH_JWT_SECRET, { expiresIn: '7d' });
        res.send({ message: 'Inicio de sesión exitoso', token, refreshToken });
      });
    })
    .catch(err => next(err));
};

exports.refreshToken = function(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({ message: 'No se proporcionó ningún token de actualización' });
  }

  jwt.verify(refreshToken, REFRESH_JWT_SECRET, (err, user) => {
    if (err) {
      return next(err);
    }

    const accessToken = jwt.sign({ id: user.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });
    res.send({ accessToken });
  });
};