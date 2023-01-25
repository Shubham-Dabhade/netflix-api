const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register",async(req,res)=>{

    //creating a new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
    });

    //saving the user in our db
    await newUser.save().then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>{
        res.status(500).json(err);
    }); 
});


//LOGIN
router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(401).json("Wrong password or Username");

        }
        else{
            // Decrypt
            const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

            if(originalPassword!==req.body.password){
                res.status(401).json("Wrong password or Username");

            }
            else{

                //after login trying to send jwt 
                const accessToken = jwt.sign(
                    {_id:user._id,isAdmin:user.isAdmin}, //info to be passed in jwt
                    process.env.SECRET_KEY,  //secret key
                    {expiresIn:"5d"} //expiration time
                );

                const {password, ...info}= user._doc;
                res.status(200).json({...info, accessToken});
            }
        }
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;
