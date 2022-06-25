const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const SECRET = "rrfrf7&*&*&nlewnf^%^%csdvlwei"


//what is middleware : middleware is kind of a function , when we want to do some operation and we want to check for some same operation again and again then we can use middlewares it will consist of 3 arga req, res, next - next means after completing operation move next or go to next parameter of the original function where you have used this middleware


const fetchuser = (req, res, next) => {

    // get the user token and id from that token

    const token = req.header("auth-token");

    if(!token){
        res.status(401).json({
            confirm:false,
            access:"denied"
        })
    }

    try {
         //you got the token now?

    const data = JWT.verify(token, SECRET);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(400).send("Token verification failed");
    }

   
}

module.exports = fetchuser;