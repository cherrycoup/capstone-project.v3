import mongoose from "mongoose";
 
const connectDb = async () => {
    try{
        if (!process.env.URI) {
            throw new Error("Missing MongoDB URI");
        }
        await mongoose.connect(process.env.URI);
        console.log("Connection success");
    }catch(error){
        console.error("Connection failed", error.message);
        process.exit(1);
    };
};

export default connectDb    
