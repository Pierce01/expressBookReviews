const express = require('express');
const session = require('express-session')
const { authenticated, isValid} = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({message: "No token provided"});
  }
  const validationObj = isValid(token)
  if (isValid(token)) {
    req.username = validationObj.username;
    next();
  } else {
    return res.status(500).json({message: "Failed to authenticate token"});
  }
});
 
const PORT = 5000;

app.use("/customer", authenticated);
app.use("/", genl_routes);

app.listen(PORT,() => console.log("Server is running"));
