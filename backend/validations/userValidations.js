// userValidations.js
const { check } = require('express-validator');

exports.registerValidations = [
  check('username').isLength({ min: 1 }).withMessage('Username must be specified.'),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
];

exports.loginValidations = [
  check('username').isLength({ min: 1 }).withMessage('Username must be specified.'),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
];

exports.refreshTokenValidations = [
  check('refreshToken').isLength({ min: 1 }).withMessage('Refresh token must be specified.')
];