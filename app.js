const express = require('express');
require('dotenv').config();
const cors = require('cors');
const router = require('./routes/router');
const path = require('path');

const app = express();

app.use(cors());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
