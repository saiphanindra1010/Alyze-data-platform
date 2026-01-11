import express, { json } from "express";

// import Connections from "./models/connections.js";
import mongoose from "mongoose";
import users from "./src/routes/users.js"
import Connections from "./src/routes/connections.js";
// import cookieSession from "cookie-session";
// import passport from "passport";
import cors from 'cors'
import auth from './src/routes/auth.js'
import cookieParser from "cookie-parser";

import csrf from "csurf";
// Initialize the app
const app = express();

// Middleware

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}))

import getmetadata from "./src/services/getMetadata.js";
// routes
const authenticateToken1 = (req, res, next) => {
  const token = req.cookies.authToken; // Token stored in HTTP-only cookie
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
const authenticateToken = (req, res, next) => {
  // Token stored in HTTP-only cookie
  try {
    let name=req.cookies.authToken;
    console.log("authhh "+name)
    // console.log("authhh "+name)
    if(name == "efkl32rtj32oikflikwle") //replace with jwt.verify
    {
      console.log("insiee")
      req.user = {name: "efkl32rtj32oikflikwle"}; // Attach decoded token to request
      next();
    }
    else
    {
      return res.status(403).json({"error":"Invalid cookie"})
    }
   
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  
  
};
let csrfProtection = csrf({ cookie: true });
app.get('/csrf',csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.get('/red', (req, res) => {
  res.json({ red: "kik" });
});
app.use("/connections",Connections)
app.use("/profile",authenticateToken,users)
app.use("/auth",auth)
app.get("/test",(req,res)=>
{
  res.json({"success":"working"})
  console.log(process.env.GOOGLE_CLIENT_SECRET)
})

app.get('/getmetadata', getmetadata);





export default app;
