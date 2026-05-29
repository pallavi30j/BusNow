const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usersDB } = require('../database');

const JWT_SECRET = 'busnow_secret_key';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  usersDB.findOne({ email }, (err, user) => {
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  });
});

router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  usersDB.findOne({ email }, (err, exists) => {
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const hash = bcrypt.hashSync(password, 10);
    usersDB.insert({ name, email, password: hash, role: role || 'student' }, (err, doc) => {
      res.json({ message: 'Account created successfully' });
    });
  });
});

module.exports = router;