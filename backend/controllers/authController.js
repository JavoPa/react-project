const { validationResult } = require('express-validator');
const { registerValidations, loginValidations, refreshTokenValidations } = require('../validations/userValidations');
const authService = require('../services/authService');

exports.register = [
  // Use validations
  ...registerValidations,

  async (req, res, next) => {
    // Handle validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Send them back to the client.
      return res.status(400).json({ errors: errors.array() });
    }

    // Input is valid. Continue with your service logic here.
    try {
      const { username, password } = req.body;
      const result = await authService.register(username, password);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
];

exports.login = [
  // Use validations
  ...loginValidations,

  async (req, res, next) => {
    // Handle validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Send them back to the client.
      return res.status(400).json({ errors: errors.array() });
    }

    // Input is valid. Continue with your service logic here.
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
];

exports.refreshToken = [
  // Use validations
  ...refreshTokenValidations,

  async (req, res, next) => {
    // Handle validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Send them back to the client.
      return res.status(400).json({ errors: errors.array() });
    }

    // Input is valid. Continue with your service logic here.
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
];