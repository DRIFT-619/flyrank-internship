const express = require('express');
const authService = require('../services/auth.service');
const { authGuard } = require('../middleware/auth-guard');

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

router.post('/auth/logout', authGuard, async (req, res, next) => {
  try {
    await authService.logOut();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/public/info', (req, res) => {
  res.status(200).json({ message: 'Welcome stranger! This info is public.' });
});

router.get('/protected/profile', authGuard, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at,
  });
});

router.get('/protected/dashboard', authGuard, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, ${req.user.email}!`,
  });
});

module.exports = router;