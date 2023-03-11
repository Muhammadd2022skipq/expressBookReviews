const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { authenticated } = require('./router/auth_users.js');

const app = express();

const JWT_SECRET = "secretstring";

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    var tokenValue = req.session.authorization['token'];
    var username = req.session.username;
    jwt.verify(tokenValue, JWT_SECRET, (err, user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            res.send(err);
        }
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));