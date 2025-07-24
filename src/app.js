const express = require('express');
const cors = require('cors');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const uploadRoute = require('./routes/uploadRoute');
const chatRoute = require('./routes/chatRoute');
const wakeRoute = require('./routes/wakeRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiKeyAuth);

app.use('/api/upload', uploadRoute);
app.use('/api/chat', chatRoute);
app.use('/api/wake', wakeRoute); 

module.exports = app;
