const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const db = require('./db');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/api/v1/devices', require('./routes/devices'))
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});
db.connectToServer(err => {
    if (err)
        return;
    app.listen(PORT, () => { console.log(`Server listening on port http://localhost:${PORT} bruh`); });
})