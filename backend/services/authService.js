const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require('../models/userModel');
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = require('../config/env');

exports.register = async function(username, password) {
  const user = await userModel.findUserByName(username);

  if (user) {
    throw new Error('El nombre de usuario ya está en uso');
  } else {
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.createUser(username, hash);
    const token = jwt.sign({ id: newUser.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: newUser.id }, REFRESH_JWT_SECRET, { expiresIn: '7d' });

    return { message: 'Usuario registrado con éxito', token, refreshToken };
  }
};

exports.login = async function(username, password) {
  const user = await userModel.findUserByName(username);

  if (!user) {
    throw new Error('No se encontró ningún usuario con ese nombre');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  const token = jwt.sign({ id: user.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_JWT_SECRET, { expiresIn: '7d' });

  return { message: 'Inicio de sesión exitoso', token, refreshToken };
};

exports.refreshToken = async function(refreshToken) {
  if (!refreshToken) {
    throw new Error('No se proporcionó ningún token de actualización');
  }

  const user = jwt.verify(refreshToken, REFRESH_JWT_SECRET);
  const accessToken = jwt.sign({ id: user.id }, ACCESS_JWT_SECRET, { expiresIn: '1h' });

  return { accessToken };
};