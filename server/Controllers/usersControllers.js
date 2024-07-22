// const users = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL
// sign up user 

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoo_models = require("../models/usersSchema");

// Signup Function
exports.signup = async (req, res) => {
    const { fname, specialization, email, password } = req.body;
  

  
    try {
      // Check if user with the email already exists
      let user = await mongoo_models.Doctor.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
         
      }
  
      // Create a new user
      user = new mongoo_models.Doctor({
        fname,
        specialization,
        email,
        password
      });
  
      console.log('user', user);
  
      // Save the user to the database
      await user.save();
  
      // Return success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  };


  exports.patsignup = async (req, res) => {
    const { fname, age, email, password } = req.body;
  

  
    try {
      // Check if user with the email already exists
      let user = await mongoo_models.Doctor.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
         
      }
  
      // Create a new user
      user = new mongoo_models.Patient({
        fname,
          age,
        email,
        password
      });
  
      console.log('user', user);
  
      // Save the user to the database
      await user.save();
  
      // Return success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  };


// Sign In
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await mongoo_models.Doctor.findOne({ email });
        console.log("user", user)
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }


        console.log("üser ---> ", user)
        //token generate 
        const token = await user.generateAuthtoken();
        console.log("we are toekne ---> ", token)
        // cookiegenerate
        res.cookie("usercookie",token,{
            expires:new Date(Date.now()+9000000),
            httpOnly:true
        }); 

        const result = {
            user,
            token
        }
        
        res.status(200).json({ message: 'Signed in successfully',result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
};



exports.validuser = async(req,res)=>{
    
    console.log("done")
    
    try {
        const ValidUserOne = await mongoo_models.Doctor.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
};

// get patients details 
// userget


exports.patientget = async (req, res) => {
  
    try{
        const usersdata = await mongoo_models.Patient.find();
        res.status(200).json(usersdata)
    }catch(error){
        res.status(401).json(error)

    }


}

exports.mypatient = async (req, res) => {
    const { doctorId } = req.query; // Read from query parameters
    console.log(doctorId);

    try {
        // Ensure doctorId is provided
        if (!doctorId) {
            return res.status(400).json({ error: 'Doctor ID is required' });
        }

        // Find patients where the doctorId is in the doctors array
        const patients = await mongoo_models.Patient.find({ doctors: doctorId });

        // Check if any patients were found
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found for this doctor' });
        }

        // Return the list of patients
        res.status(200).json({ message: 'List of patients is present', patients });
    } catch (error) {
        // Handle any errors that occur
        console.error(error); // Log error for debugging purposes
        res.status(500).json({ error: 'Internal server error' });
    }
};




//connect
// // Example function to connect a patient to a doctor

// {
//     "doctorId": "some id",
//     "patientId": "some id",
//     "action": "connect"
// }

exports.connect = async (req, res) => {
    const { doctorId, patientId, action } = req.body; // Assuming action is 'connect' or 'disconnect'

    try {
        // Find the doctor and patient by their IDs
        const doctor = await mongoo_models.Doctor.findById(doctorId);
        const patient = await mongoo_models.Patient.findById(patientId);
    
        if (!doctor || !patient) {
            return res.status(404).json({ error: 'Doctor or patient not found' });
        }

        // Perform action based on 'action' parameter
        if (action === 'connect') {
            // Check if patient is already connected to this doctor
            if (doctor.patients.includes(patientId)) {
                return res.status(400).json({ message: 'Patient is already connected to this doctor' });
            }
    
            // Check if doctor is already connected to this patient
            if (patient.doctors.includes(doctorId)) {
                return res.status(400).json({ error: 'Doctor is already connected to this patient' });
            }
    
            // Update the doctor's patients array
            doctor.patients.push(patientId);
            await doctor.save();
    
            // Update the patient's doctors array
            patient.doctors.push(doctorId);
            await patient.save();
    
            // Send success response
            return res.status(200).json({ message: 'Patient connected to doctor successfully', doctor, patient });
        } else if (action === 'disconnect') {
            // Check if patient is connected to this doctor
            if (!doctor.patients.includes(patientId)) {
                return res.status(400).json({ error: 'Patient is not connected to this doctor' });
            }
    
            // Check if doctor is connected to this patient
            if (!patient.doctors.includes(doctorId)) {
                return res.status(400).json({ error: 'Doctor is not connected to this patient' });
            }
    
            // Remove patient from doctor's patients array
            doctor.patients = doctor.patients.filter(id => id.toString() !== patientId);
            await doctor.save();
    
            // Remove doctor from patient's doctors array
            patient.doctors = patient.doctors.filter(id => id.toString() !== doctorId);
            await patient.save();
    
            // Send success response
            return res.status(200).json({ message: 'Patient disconnected from doctor successfully', doctor, patient });
        } else {
            return res.status(400).json({ error: 'Invalid action. Use "connect" or "disconnect"' });
        }
    } catch (error) {
        console.error('Error connecting/disconnecting patient to/from doctor:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};




// upload pdf 
//is workign fine now please make necessary changes 

exports.uploadPdf = async (req, res) => {
    try {

        const fileUrl = req.file.location; // S3 URL
        const { doctorId } = req.body;
      
        console.log("fileUrl ->",fileUrl)
       console.log("doctorId", doctorId)
        // Update the doctor document to include the uploaded PDF URL
        const doctor = await mongoo_models.Doctor.findByIdAndUpdate(
            doctorId,
            { $push: { pdfs: fileUrl } }, // Only add fileUrl to pdfs array
         
          );

          
          // Update doctor document
        

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

      

        res.status(201).json({ message: 'File uploaded successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
};







// end here


