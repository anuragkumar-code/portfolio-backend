const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Backend awake' });
});

module.exports = router;
