const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");



//CREATE 

router.post("/",verify,async(req,res)=>{
    if( req.user.isAdmin){
        const newList = new List(req.body);

        //saving the new list
        try{
            const savedList = await newList.save();
            res.status(201).json(savedList);
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//DELETE
router.delete("/:id",verify,async(req,res)=>{
    if( req.user.isAdmin){
        try{
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json("The list has been deleted");
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//GET LIST FOR HOME PAGE

router.get("/",verify, async(req,res)=>{
    const type = req.query.type;
    const genre =req.query.genre;

    let list= [];

    try{
        if(type){
            if(genre){
                list = await List.aggregate([
                    {
                        $match:{type:type,genre:genre}
                    },{
                        $sample:{size:10},
                    }
                ]);
            }else{
                list = await List.aggregate([
                    {
                        $match:{type:type},
                    },{
                        $sample:{size:10},
                    }
                ]);
            }
        }else{
            list = await List.aggregate([
                {
                    $sample:{size:10}
                }
            ])
        }
        res.status(200).json(list);
    }catch(err){
        res.status(500).json(err);
    }
});






module.exports = router;