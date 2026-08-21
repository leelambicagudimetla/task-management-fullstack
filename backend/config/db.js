const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
        family: 4
        })
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));
    }catch(error){
        console.error({
            message: error.message,
            
        });
        process.exit(1);
    }
}

module.exports = connectDB;