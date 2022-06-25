const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuser.js");
const SECRET = "rrfrf7&*&*&nlewnf^%^%csdvlwei"

//create a user using post "/api/auth" does not require auth
router.post("/createUser", [
    body("name","Enter a valid name").isLength({min:3}),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({min:5})
] ,async (req, res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array() });
    }

    //checking whether user exists with same email 
    try{
        let user = await User.findOne({email:req.body.email});

        if(user){
            res.status(400).json({
                message:"user already exists please log in"
            })
        }
    
        else{
            res.status(200).json({
                message:"Creating the user"
            })
        }
        
        //we will hash password here : creating salt here

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt); 
    
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPassword
        })


        const data = {
            user : {
                id: user.id
            }
        }

        //below method will generate token
        const authToken = JWT.sign(data, SECRET);

        res.json({
            token:authToken
        })

        //whenever I will receive this token I will be able to convert this to data to verify the user 
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong from server side")
    }
   
    
})




// Endpoint 2 : login endpoint : checking user => localhost:8080/api/auth/login

router.post("/login", [
    
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
    
] ,async (req, res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array() });
    }


    const {email , password}  = req.body;

    try {
        //finding the user in database:

        let is_User_Exist = await User.findOne({email});

        if(!is_User_Exist){
            res.status(400).json({
                confirm:false,
                message:"Incorrect information"
            })


        }

        let comparePassword = await bcrypt.compare(password, is_User_Exist.password)

        if(!comparePassword){
            res.status(400).json({
                confirm:false,
                message:"Incorrect information"
            })
        }

        const data = {
            user : {
                id: is_User_Exist.id
            }
        }

        //below method will generate token
        const authToken = JWT.sign(data, SECRET);
        res.send(authToken);

    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong from server side")
    }



})




//route:3 => details of all logged in users : login required : localhost:8080/api/auth/getuser
router.post("/getuser",fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        let user = await User.findById(userId).select("-password");
        res.send(user);
    } catch(error) {
        res.status(500).send("Something went wrong from server side")
    }

   
})
module.exports = router;