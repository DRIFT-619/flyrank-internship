const express = require('express');
const authService = require('../services/auth.service');

const router = express.Router();

router.post('/auth/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await authService.signUp(email, password);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const tokens = await authService.logIn(email, password);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
});

module.exports = router;