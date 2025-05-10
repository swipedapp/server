import express from "express";
import http from "http";
import os from "os";
import path from "path";
import bodyParser from "body-parser";
import { db, SettingState } from "./db.js";

// init
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/request", (req, res) => {
	const id = req.body.id;
	const device = db.prepare(`select * from devices where authkey = ?`)
		.get(id);

	if (!device) {
		db.prepare(`insert into devices (authkey) values (?)`)
			.run(id);
	}
	res.json({
		registration: device ?? 1
	});
});
app.post("/sync", (req, res) => {
	const id = req.body.id;
	const size = req.body.size;
	const device = db.prepare(`select * from devices where authkey = ?`)
		.get(id);
	db.prepare(`update devices set size = ? where (authkey)`)
		.run(id);
	if (!device) {
		res.json({
			registration: "what"
		});
	}
	res.json({
		registration: device ?? 1
	});
});
app.get("/status", (req, res) => {
	const size = db.prepare(`SELECT sum(size) FROM devices where settingstate = 1`)
		.get()
	["sum(size)"];
	res.json({
		saving: size
	});
});

const PORT = process.env.PORT || 1313;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

