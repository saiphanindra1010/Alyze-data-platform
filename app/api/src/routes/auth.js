import express from "express";
import jwt from "jsonwebtoken"
import googleLogin from "../controllers/authController.js";
// import otpLogin from "../controllers/otpLogin.js"
const router = express.Router();



router.get("/googleauth", googleLogin);
router.post("/validateToken", async (req,res)=>
{
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
//   console.log("headder "+token )
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
  
    try {
        console.log("jeee "+process.env.JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
    console.log("decoded "+ decoded)
    return   res.status(200).json({ valid: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token '+err });
    }
});


// router.get("/emaileauth", otpLogin);

export default router;
