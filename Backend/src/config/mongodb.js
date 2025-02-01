import mongoose from "mongoose";

const conntectDb = async() => {
    mongoose.connection.on('connected',() => {
        console.log("db connected");
        
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/spotify`)
}

export default conntectDb;