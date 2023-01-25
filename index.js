const express= require("express");
const app = express();
const mongoose=require("mongoose");
const dotenv= require("dotenv");
const authRoute= require("./routes/auth");
const userRoute= require("./routes/users");
const movieRoute= require("./routes/movies");
const listRoute= require("./routes/lists");
const cors = require('cors');
app.use(cors());

dotenv.config();

app.use(express.json());


//creating mongo db connection
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connection successfull");
}).catch((err)=>{
    console.log(err);
});


//using the routes
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/movie",movieRoute);
app.use("/api/lists",listRoute);



app.listen(process.env.PORT || 8800,()=>{
    console.log("backend server is running");
});