const express = require('express');
const { uploadDocument } = require('../controllers/uploadController');
const { deleteAllVectors } = require('../controllers/deleteController');

const router = express.Router();

router.post('/', uploadDocument);

router.delete('/clear', deleteAllVectors);
module.exports = router;
