const mongoose=require('mongoose')


const invalidSchema = new mongoose.Schema({
    email: { type: String, required: true },
    attempts:{type: Boolean}
}, {
    timestamps:true
})
const InvalidLogin=mongoose.model("InvalidLogin",invalidSchema);
module.exports={InvalidLogin}