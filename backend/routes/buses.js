const express = require('express');
const router = express.Router();
const { busesDB } = require('../database');

router.get('/', (req, res) => {
  busesDB.find({}, (err, buses) => {
    if (err) return res.status(500).json({ message: 'Error fetching buses' });
    res.json(buses);
  });
});

module.exports = router;