const express = require("express")
const app = express();
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const {ObjectId} = require("mongodb")
app.use(express.json())
require('dotenv').config()
const { Job }=require('./models/jobs.models.js');
const {SecretData}=require('./models/secretData.model.js')
const {Users} =require('./models/user.model.js')
const {Compan} =require('./models/company.model.js');
const { Application } = require("./models/applications.model.js");


// import express from "express";
// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import {Job} from './models/jobs.models.js';
// const app=express();

const mongoUrl = process.env.dbHost
const PORT= process.env.PORT
mongoose.connect(mongoUrl).then(() => {
    console.log("Database Connected");
}).catch((error) => {
    console.log(error);
})

app.listen(PORT, () => {
    console.log("Node js server started"+PORT);
})

//APIs

app.post("/signup", async (req, res) => {
    const {
        name, email, password, role
    } = req.body;

    const oldUser = await SecretData.findOne({ email });
    if (oldUser) {
        return res.send({ status: "twice", data: "User Already Exists" });
    }

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        await SecretData.create({ name, email, password: hashpassword, role });

        if (role === "Job Seeker") {
            const user=new Users({
                name,
                email,
                contact: "",
                address: "",
                objective: "",
                profilePhoto: "",
                skills: [],
                education: [],
                experience: [],
                certifications: [],
            })
            await user.save();
                
            
            return res.send({ status: "ok", data: "User Registered Successfully" });
        } else if (role === "Employer") {
            const company=new Compan({
                name,
                motto:"",
                type:"",
                address: "",
                followers: "",
                employees: "",
                coverPhoto: "",
                profilePhoto: "",
                overview: "",
                foundedDate: "",
                benefits: [],
                contact :"",
                email,
                socialMedia: {
                  linkedin: "",
                  twitter: "",
                  facebook:"",

            }
        });
            await company.save();
           
            return res.send({ status: "ok", data: "Company Registered Successfully" });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.send({ status: "Error", data: "Something went wrong" });
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const user = await SecretData.findOne({ email });
        if (!user) {
            return res.send({ status: "Error", data: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.send({ status: "Error", data: "Invalid credentials" });
        }

        // Respond with success and optionally return user data (excluding the password)
        res.send({
            status: "ok", data: {
                message: "Login successful",
                user: { role: user.role, },
            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.send({ status: "Error", data: "Something went wrong" });
    }
})

app.post("/getDetails", async (req, res) => {
    const { email } = req.body;
    const exists = await SecretData.findOne({ email})
    
    if (exists) {        
        try {
            if (exists.role == "Job Seeker") {
                const userExists = await Users.findOne({ email})
                if (userExists) {                  
                    return res.send({
                        status: "oku", data: {
                            message: "Data Found",
                            user: {
                                name: userExists.name,
                                email: exists.email,
                                contact: userExists.contact,
                                address: userExists.address,
                                objective: userExists.objective,
                                profilePhoto: userExists.profilePhoto,
                                skills: userExists.skills,
                                education: userExists.education,
                                experience: userExists.experience,
                                certifications: userExists.certifications,
                            }
                        }
                    })
                }
            }
            else if (exists.role == "Employer") {
                const userExists = await Compan.findOne({ email})
                if (userExists) {
                    return res.send({
                        status: "okc", data: {
                            message: "Data Found company",
                            company: {  
                                name:userExists.name,
                                email:exists.email,
                                motto:userExists.motto ,                type:userExists.type, 
                                address:userExists.address ,            followers:userExists.followers,
                                employees:userExists.employees ,        coverPhoto:userExists.coverPhoto, 
                                profilePhoto:userExists.profilePhoto ,  overview:userExists.overview, 
                                foundedDate:userExists.foundedDate,     benefits:userExists.benefits, 
                                contact:userExists.contact ,            socialMedia:userExists.socialMedia
                             },
                        }
                    })
                }
            }
        } catch (err) {
            res.send({ status: "Error", data: err })
        }
    }
    else {
        return res.send({ status: "Error", data: "Data Not Found" })
    }
})

app.post("/updateUserResume", async (req, res) => {
    const {email, name, contact, address,profilePhoto,objective,certifications,skills , education, experience} = req.body;
    // Validate email presence
    if (!email) {
        return res.send({ status: "Error", data: "Email is required" });
    }
    try {
        // Check if the user exists

        const existingUser = await Users.findOne({ email });
        
        if (!existingUser) {
            return res.send({ status: "Error", data: "User not found" });
        }
        // Update the user's resume details
        const updatedUser = await Users.findOneAndUpdate(
            { email }, // Find user by email
            {
                $set: {
                    name: name || existingUser.name,
                    contact: contact || existingUser.contact,
                    address: address || existingUser.address,
                    profilePhoto: profilePhoto || existingUser.profilePhoto,
                    objective: objective || existingUser.objective,
                    skills: skills.length ? skills : existingUser.skills,
                    education: education.length ? education : existingUser.education,
                    experience: experience.length ? experience : existingUser.experience,
                    certifications: certifications.length ? certifications : existingUser.certifications,
                },
            },
            { new: true } // Return the updated document
        );

        // Respond with the updated user details
        res.send({status: "ok", data: { message: "User resume updated successfully", user: updatedUser } });
    } catch (err) {
        res.send({ status: "Error", data: "Internal Server Error" });
    }
});


app.post("/updateCompanyData", async (req, res) => {
    const {name,motto, type, address,followers, employees, coverPhoto, profilePhoto,overview, foundedDate,benefits,contact, email,socialMedia} = req.body;
    // Validate email presence
    if (!email) {
        return res.send({ status: "Error", data: "Email is required" });
    }

    try {
        // Check if the user exists
        const existingUser = await Compan.findOne({ email });
        if (!existingUser) {
            return res.send({ status: "Error", data: "User not found" });
        }
        // Update the user's resume details
        const updatedCompany = await Compan.findOneAndUpdate(
            { email }, // Find user by email
            {
                $set: {
                    name: name || existingUser.name,
                    contact: contact || existingUser.contact,
                    address: address || existingUser.address,
                    profilePhoto: profilePhoto || existingUser.profilePhoto,
                    overview: overview || existingUser.overview,
                    motto: motto || existingUser.motto,
                    followers: followers || existingUser.followers,
                    type: type || existingUser.type,
                    employees: employees || existingUser.employees,
                    foundedDate: foundedDate || existingUser.foundedDate,
                    coverPhoto: coverPhoto || existingUser.coverPhoto,
                    benefits: benefits.length ? benefits : existingUser.benefits,
                    socialMedia:  socialMedia.length? socialMedia : existingUser.socialMedia,
                },
            },
            { new: true } // Return the updated document
        );

        // Respond with the updated user details
        res.send({status: "ok", data: { message: "Company Data updated successfully", company: updatedCompany } });
    } catch (err) {
        res.send({ status: "Error", data: "Internal Server Error" });
    }
});


app.post("/addJob", async (req, res) => {
    const { title, companyName, description, additional, salary, skills, jobStatus, type,address,email} = req.body;

    try { 
        const companyExists=await Compan.findOne({email:email})    
        if(companyExists){
            const job =new Job({
                email,
                title,
                companyName:companyExists.name,
                description,
                additional,
                salary,
                skills, jobStatus, type,address,
            });
            await job.save();
    
            res.send({ status: "ok", data: job})
            
        }
        
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
})



app.post("/getJobs", async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.send({status:"Error", data:"Email is required"})
    }
    try {
        const jobExists=await Job.find({email:email})
        if (jobExists){
            res.send({ status: "ok", data: {
                message:"Job Found for given email",
                jobs:jobExists
            } 
        })
        }else{
            return res.send({status:"No", data:"No Job found"})
        }
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
})


app.get("/getAllJobs", async (req, res) => {
    try {
        const jobExists=await Job.find({})
        if (jobExists.length>0){
            res.send({ status: "ok", data: {
                message:"Job Found for given email",
                jobs:jobExists
            } 
        })
        
        }else{
            return res.send({status:"No", data:"No Job found"})
        }
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
})

app.get('/jobSearch', async (req, res) => {
    const { title } = req.query;
  
    const filters = {};
  
    if (title) filters.title = { $regex: title, $options: 'i' };
    // if (location) filters.location = { $regex: location, $options: 'i' };
    // if (skills) filters.skills = { $in: skills.split(',') };
  
    try {
      const jobs = await Job.find(filters);
      res.send({ status: "ok", data: {
        message:"Job Found for given email",
        jobs
    }
}) 
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
  });
  

app.delete("/deleteJob/:id", async (req, res) => {
    const { id } = req.params; // Get the id from the URL parameter
    if (!id) {
        return res.send({status: "Error", data: "Job id is required"});
    }
    
    try {
        console.log(id);
        
        const newID=new ObjectId(id)
    console.log(newID);
        const jobExists = await Job.findByIdAndDelete(newID);
        if (jobExists) {
            return res.send({status: "ok",data: "Selected Job deleted"});
        } 
        else {
            return res.send({status: "No", data: "No Job found"});
        }

    } catch (err) {
        return res.send({status: "error", data: "Operation Unsuccessful: " + err.message });
    }
});

app.post("/submitApplication", async (req, res) => {
    const {jobID,company, contact,address,skills,education,experience, certifications, name, email, profilePhoto,interviewDate,interviewTime,jobTitle,about} = req.body;

    const existingJob = await Application.findOne({ email:email, jobID:jobID });
    if (existingJob) {
        return res.send({ status: "twice", data: "Already applied in this job" });
    }

    try {        
        const application =new Application({
            jobID,company, contact,address,skills,education,experience, certifications, name, email, profilePhoto,interviewDate,interviewTime,jobTitle,about
        });
        await application.save();

        res.send({ status: "ok", data: "Application Submited Successfully"})
        
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
})

app.post("/getApplications", async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.send({status:"Error", data:"Email is required"})
    }
    try {
        const appExists=await Application.find({company:email})
        if (appExists){
            res.send({ status: "ok", data: {
                message:"Applications Found for given email",
                applications:appExists
            }             
        })
        }else{
            return res.send({status:"No", data:"No Job found"})
        }
    } catch (err) {
        res.send({ status: "error", data: "Operation Unsuccessfull"+(err) })
    }
})


app.post("/sheduleInterview", async (req, res) => {
    const {email,jobID,interviewDate,interviewTime} = req.body;
    console.log(email);
    // Validate email presence
    if (!email) {
        return res.send({ status: "Error", data: "Email is required" });
    }
    
    try {
       
        const updatedApplication = await Application.findOneAndUpdate(
            { email,jobID }, // Find user by email
            {
                $set: {
                    interviewDate, interviewTime
                },
            },
            { new: true } // Return the updated document
        );

        // Respond with the updated user details
        res.send({status: "ok", data: { message: "Company Data updated successfully", company: updatedApplication } });
    } catch (err) {
        res.send({ status: "Error", data: "Internal Server Error" });
    }
});


app.post("/getRecommendedJobs", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.send({ status: "error", data: "Email is required" });
    }

    try {
        // Find the user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.send({ status: "error", data: "User not found" });
        }

        // Extract skills from the user and find matching jobs
        const recommendedJobs = await Job.find({ skills: { $in: user.skills } });

        if (recommendedJobs.length > 0) {
            return res.send({
                status: "ok",
                data: {
                    message: "Jobs found for the given email",
                    jobs:recommendedJobs
                }
            });
        } else {
            return res.send({
                status: "no",
                data: "No matching jobs found"
            });
        }
    } catch (err) {
        console.error("Error in /getRecommendedJobs:", err);
        return res.send({
            status: "error",
            data: "An error occurred while processing the request"
        });
    }
});

app.post("/getAppliedJobs", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.send({ status: "Error", data: "Email is required" });
    }
    try {
        // Find all applications for the given email
        const applications = await Application.find({ email });
        if (applications.length === 0) {
            return res.send({ status: "No", data: "No Applied Job found" });
        }

        // Collect all job IDs from the applications
        const jobIds = applications.map(app => new ObjectId(app.jobID));
        const jobs = await Job.find({ _id: { $in: jobIds } });

        if (jobs.length > 0) {
            // Merge jobs with application data (date and time)
            const mergedData = jobs.map(job => {
                const application = applications.find(app => app.jobID.toString() === job._id.toString());
                return {
                    ...job.toObject(), // Include job details
                    interviewDate: application?.interviewDate || "pending", // Add interview date
                    interviewTime: application?.interviewTime || "pending", // Add interview time
                };
            });

            return res.send({
                status: "ok",
                data: {
                    message: "Applied jobs found for the given email",
                    jobs: mergedData
                }
            });
        } else {
            return res.send({ status: "No", data: "No jobs found for the applications" });
        }
    } catch (err) {
        res.send({ status: "error", data: "Operation unsuccessful: " + err.message });
    }
});




//_______________________________________________________________________________________________________________________________________________________

//Schema Models



// const Jobs = mongoose.model("Jobs", jobSchema)







