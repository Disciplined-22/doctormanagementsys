const mongoose = require("mongoose");

const DB = process.env.DB
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:false
}).then(()=> console.log("DataBase Connected")).catch((err)=>{
    console.log(err);
})