import mongoose from "mongoose";


export const connectToDb  = async ()=>{
    try {
        const mongoUrl = process.env.MONGODB_URI as string;
        if (mongoose.connections[0].readyState){
            console.log("already connected");
            return;
        }
        await mongoose.connect(mongoUrl).then(()=>{
            console.log("connected to db successfully");
        })
    } catch (error) {
        console.log("error connecting to db => " , error);
        process.exit(1);
    }
}