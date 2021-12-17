const express = require('express');
const { ObjectId } = require('mongodb');
const dbo = require('../db');

let router = express.Router();

class Device {
	ip = "";
	mac = "";
	constructor(name, ports, position) {
		this.name = name;
		this.ports = ports;
		this.position = position;
	}
}

// GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
router.post('', async (req, res, next) => {
	const db = dbo.getDb();
	const { name, position, ip, mac, ports } = req.body;
	const device = new Device(name, ports, position);
	device.ip = ip;
	device.mac = mac;
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

router.get('/:id', async (req, res, next) => {
	const id = req.params.id;
	const db = dbo.getDb();
	db.collection('devices').find({ _id: new ObjectId(id) }).toArray((err, result) => {
		if (err) {
			res.status(400).send("Error fetching listings!");
		} else {
			res.json(result);
		}
	});
});
module.exports = router;