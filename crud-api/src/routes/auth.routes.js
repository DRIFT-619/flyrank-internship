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

router.get('/public/info', (req, res) => {
  res.status(200).json({ message: 'Welcome stranger! This info is public.' });
});

router.get('/protected/profile', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const user = await authService.verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;