import "dotenv/config";
import express from "express";
import http from "http";
import os from "os";
import path from "path";
import bodyParser from "body-parser";
import { db, SettingState } from "./db.js";
import { verify } from "./appstore.js";
import morgan from "morgan";

// init
const app = express();
const server = http.createServer(app);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));

async function getTransactionID(receipt) {
	const result = await verify(receipt);
	return result.appTransactionId;
}

app.post("/register", async (req, res) => {
	const authKey = await getTransactionID(req.body.receipt);
	const device = db.prepare(`select * from devices where authkey = ?`)
		.get(authKey);

	if (!device) {
		db.prepare(`insert into devices (authkey) values (?)`)
			.run(authKey);
	}
	res.json({
		registration: device ?? 1
	});
});

app.post("/sync", async (req, res) => {
	const authKey = await getTransactionID(req.body.receipt);
	const size = req.body.size;
	const device = db.prepare(`select * from devices where authkey = ?`)
		.get(authKey);
	if (!device) {
		res.json({
			registration: "what"
		});
		return;
	}

	const totalKept = req.body.totalKept;
	const totalDeleted = req.body.totalDeleted;
	const totalPhotoDeleted = req.body.totalPhotoDeleted;
	const totalVideoDeleted = req.body.totalVideoDeleted;
	const spaceSaved = req.body.spaceSaved;
	const swipeScore = req.body.swipeScore;

	db.prepare(`update devices set updated_at = current_timestamp, total_kept = ?, total_deleted = ?, total_photo_deleted = ?, total_video_deleted = ?, space_saved = ?, swipe_score = ? where authkey = ?`)
		.run([totalKept, totalDeleted, totalPhotoDeleted, totalVideoDeleted, spaceSaved, swipeScore, authKey]);
	res.json({
		registration: device ?? 1
	});
});

app.get("/status", (req, res) => {
	const size = db.prepare(`SELECT sum(space_saved) total_saved FROM devices where settingstate = 1`)
		.get();
	res.json({
		size
	});
});

const PORT = process.env.PORT || 1314;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

