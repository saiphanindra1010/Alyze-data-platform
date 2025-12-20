import express from 'express'

const router = express.Router();
import User from '../models/userModel.js';

router.get("/", async (req, res) => {

    console.log("req" + JSON.stringify(req.user))
    let user = await User.findOne({ email: "saiphanindra0205@gmail.com" })
    return res.json({ "profile": user })

}

)
router.put("/", async (req, res) => {

    let user = await User.findOne({ email: "saiphanindra0205@gmail.com" })
    return res.json({ "profile": user })

}

)


export default router
