const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute');
const chatRoute = require('./routes/chatRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoute);
app.use('/api/chat', chatRoute);

module.exports = app;
