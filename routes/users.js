const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");



//UPDATE    
router.put("/:id",verify,async(req,res)=>{
    if(req.user._id === req.params.id || req.user.isAdmin){

        //IF THERE IS PASSWORD TO BE UPDATED
        if(req.body.password){
            req.body.password=CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try{
            const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}); //it sends the previous value, so we have to mention new:true
            res.status(200).json(updatedUser);
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You can Update only your account");
    }
});

//DELETE
router.delete("/:id",verify,async(req,res)=>{
    if(req.user._id === req.params.id || req.user.isAdmin){

        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");  
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You can delete only your account");
    }
});


//GET
router.get("/find/:id",async(req,res)=>{
    try{
        await User.findById(req.params.id).then((user)=>{
            const {password, ...info} = user._doc;
            res.status(200).json(info);  
        })
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ALL {IN ADMIN PANEL}
router.get("/",verify,async(req,res)=>{
    const query= req.query.new; //taking the query like ?new=true
    if(req.user.isAdmin){
        try{
            const users= query ? await User.find().sort({_id:-1}).limit(5) : await User.find().sort({_id:-1});
            res.status(200).json(users);  
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You do not have admin rights");
    }
});


//GET USER STATS {IN ADMIN PANEL}
router.get("/stats", async(req,res)=>{
    const today = new Date();
    const lastYear= today.setFullYear(today.setFullYear-1); //provides us the last year


    try{
        const data = await User.aggregate([
            {
                $project:{
                    month:{$month:"$createdAt"} //this will aggregate the data based on their month of created eg: for january it will have value 1
                }
            },{
                $group:{
                    _id:"$month", //it is pointed toward the name month on the top inside project
                    total:{$sum:1} //for getting the total sum for a project
                }
            }
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }

});



module.exports = router;