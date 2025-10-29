const mongoose = require('mongoose')

const connectDB = async() => {
    try{

        await mongoose.connect(process.env.DB_LINK)
        console.log("MongoDB connected successfully")

    }
    catch(err)
    {

        console.error(err)
    }
}

module.exports=connectDB