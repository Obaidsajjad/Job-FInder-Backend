const mongoose=require('mongoose');
const SecretSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },

}, {
    collection: "SecretData"
})
const SecretData = mongoose.model("SecretData", SecretSchema)
module.exports={SecretData}