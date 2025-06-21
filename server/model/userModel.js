import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firsName: { type: String },
    lastName: { type: String },
    creditBalance: { type: Number,default:5 } 

})

// if the model is already created then use it else create a new model 
const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel