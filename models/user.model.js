const mongoose=require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    contact: { type: String },
    address: { type: String },
    profilePhoto: { type: String },
    objective: { type: String },
    skills: [{ type: String }],
    education: [
        {
            degree: { type: String },
            institution: { type: String },
            city: { type: String },
            year: { type: String },
        },
    ],
    experience: [
        {
            role: { type: String },
            company: { type: String },
            city: { type: String },
            duration: { type: String },
        },
    ],
    certifications: [
        {
            title: { type: String },
            issuer: { type: String },
        },
    ],

}, {
    collection: "Users"
})
const Users = mongoose.model("Users", UserSchema)
module.exports={Users}