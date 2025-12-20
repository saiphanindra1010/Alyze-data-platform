



import express from "express";
// import generateShotendUrl from '../controllers/validateUrl.js';
const router = express.Router();
const app = express();
import mongoose from "mongoose";
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection("connections");
    const get_connection = await collection.find({}).toArray();
    console.log("these are connection coll " + JSON.stringify(get_connection));
    return res.json({ data: get_connection });
  } catch (err) {
    res.status(500).json({ error: "Internal Sersver Error" });
  }
});
router.post("/", async (req, res) => {
  try {
    let { name } = req.body;
    console.log("this is req " + name);
    Connections.create({ name: name });
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  return res.json({ put: "need to do" });
});
export default router;
