const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");



//CREATE 

router.post("/",verify,async(req,res)=>{
    if( req.user.isAdmin){
        const newMovie = new Movie(req.body);


        //saving the new movie

        try{
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//UPDATE THE MOVIE

router.put("/:id",verify,async(req,res)=>{
    if( req.user.isAdmin){
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                {$set:req.body},
                {new:true}
            );
            res.status(200).json(updatedMovie);
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//DELETE THE MOVIE

router.delete("/:id",verify,async(req,res)=>{
    if( req.user.isAdmin){
        try{
            await Movie.findByIdAndDelete(req.params.id,);
            res.status(200).json("the movie has been deleted...");
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//GET ALL COLLECTION

router.get("/",verify,async(req,res)=>{
    if( req.user.isAdmin){
        try{
            await Movie.find().then((movies)=>{
                res.status(200).json(movies.reverse());
            }).catch((err)=>{
                res.status(401).json("no files in the directories");
            });
        }catch(err){
            res.status(500).json(err);
        }

    }
    else{
        res.status(403).json("You are not allowed!");
    }
});


//GET

router.get("/find/:id",verify,async(req,res)=>{
    try{
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);

    }catch(err){
        res.status(500).json(err);
    }
});


//GET RANDOM MOVIE FOR FEATURED MOVIE

router.get("/random",verify,async(req,res)=>{
    const type = req.query.type;
    let movie;

    try{
        if(type==="series"){
            movie = await Movie.aggregate([
                {
                    $match:{isSeries:true}
                },
                {
                    $sample:{size:1}
                },
            ]);
        }else{
            movie = await Movie.aggregate([
                {
                    $match:{isSeries:false}
                },
                {
                    $sample:{size:1}
                },
            ]);
        }
        res.status(200).json(movie); 

    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router;