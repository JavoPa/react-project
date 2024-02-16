const bcrypt = require('bcrypt');
const { db } = require('../config/db'); // Asegúrate de que la ruta al archivo db.js es correcta

exports.createUser = function(username, password) {
  return bcrypt.hash(password, 10)
    .then(hashedPassword => {
      return db.query('INSERT INTO usuarios (nombre, password) VALUES (?, ?)', [username, hashedPassword]);
    });
};

exports.findUserByName = function(username) {
  return db.query('SELECT id, nombre, password FROM usuarios WHERE nombre = ?', [username])
    .then(([results]) => {
      if (results.length > 0) {
        return results[0]; // Devuelve el usuario encontrado
      } else {
        return null; // No se encontró ningún usuario con ese nombre
      }
    })
    .catch(err => {
      // Aquí deberías manejar el error de alguna manera
      console.error(err);
      throw err; // O re-lanza el error
    });
};

exports.verifyPassword = function(user, password) {
  return bcrypt.compare(password, user.password)
    .then(result => {
      if (result) {
        return user; // La contraseña es correcta
      } else {
        return null; // La contraseña es incorrecta
      }
    });
};