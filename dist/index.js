import express from 'express';
import dotenv from 'dotenv';
import router from './src/router/index.js';
dotenv.config();
var app = express();
var port = process.env.PORT || 3003;
app.use(express.json());
router(app);
app.listen(port, function () {
    console.log("\u26A1\uFE0FZalapp at http://localhost:".concat(port));
});
