const mongoose=require('mongoose');
const CompanySchema = new mongoose.Schema({
    name: {type:String},
    motto: {type:String},
    type: {type:String},
    address: {type:String},
    followers: {type:String},
    employees: {type:String},
    coverPhoto: {type:String},
    profilePhoto: {type:String},
    overview: {type:String},
    foundedDate: {type:String},
    benefits: [{type:String}],
    contact:{type:String},
    email:{type:String, required:true},
    socialMedia: {
      linkedin: {type:String},
      twitter: {type:String},
      facebook: {type:String},
    },

}, {
    collection: "Company"
})

const Compan =mongoose.model("Compan",CompanySchema)
module.exports={Compan}









const Company = mongoose.model("Company", CompanySchema)