const mongoose=require('mongoose')


const applicationSchema = new mongoose.Schema({

    jobID: { type: String ,required:true},
    company: { type: String },
    contact: { type: String },
    address: { type: String },
    skills: [{ type: String }],
    name: { type: String },
    email: { type: String },
    profilePhoto: { type: String },
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
    interviewDate: { type: String },
    interviewTime: { type: String },
    place: { type: String },
    jobTitle: { type: String },
    about: { type: String }


}, {
    timestamps:true
})
const Application=mongoose.model("JobApplications",applicationSchema);
module.exports={Application}