const express = require('express');
require('dotenv').config();
// Kết nối với CSDL MongoDB sử dụng MongoDBCompass
const database = require('./config/database');
database.connect();

// Router ver 1
const routesVer1 = require('./api/v1/routes/index.route');

const app = express();
const PORT = process.env.PORT;


routesVer1(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});