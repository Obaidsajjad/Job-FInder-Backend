const mongoose=require('mongoose')


const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    companyName: { type: String },
    description: { type: String },
    additional: { type: String },
    salary: { type: String, required: true },
    skills: [{ type: String, required: true }],
    jobStatus: { type: String },
    type: { type: String },
    address: { type: String },
    email: { type: String,required: true },
    // id:{type : String, unique:true}

}, {
    timestamps:true
})
const Job=mongoose.model("Job",jobSchema);
module.exports={Job}