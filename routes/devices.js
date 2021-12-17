const express = require('express');
const dbo = require('../db');

let router = express.Router();

// GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
router.post('', async (req, res, next) => {
	const db = dbo.getDb();
	const device = { name: 'router' };
	db.collection('devices').insertOne(device, (err, result) => {
		if (err) res.status(400).send(err);
		else res.send(result);
	})
});

router.get('', async (req, res, next) => {
	const db = dbo.getDb();
	db.collection('devices').find({}).toArray((err, result) => {
		if (err) {
			res.status(400).send("Error fetching listings!");
		} else {
			res.json(result);
		}
	});
});
module.exports = router;