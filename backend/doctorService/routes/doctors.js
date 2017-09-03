var express = require('express');
var router = express.Router();
var passport = require('passport');
var Doctor = require('../db_schema_modules/doctor');
var Patient = require('../db_schema_modules/patients');
var Verify    = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res){


    var doctor = new Doctor({username : req.body.username , password : req.body.password});
    
        if(req.body.firstname) {
            doctor.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            doctor.lastname = req.body.lastname;
        }

        if(req.body.address){
            if(req.body.address.country){
                doctor.address.country = req.body.address.country;
            }
            if(req.body.address.city){
                doctor.address.city = req.body.address.city;
            }
            if(req.body.address.zip){
                doctor.address.zip = req.body.address.zip;
            }
            if(req.body.address.street){
                doctor.address.street = req.body.address.street;
            }
        }

        if(req.body.email){
            doctor.email = req.body.email;
        }
		
        if(req.body.photo){
            doctor.photo = req.body.photo;
        }
        if(req.body.phone){
            doctor.phone = req.body.phone;
        }
        

	Doctor.register(doctor, req.body.password, function(err, patientData){
		if(err){
            console.log("error occurred "+err);
			return res.status(500).json({err : err});
		}
		

		patientData.save(function(err,doctor){
			passport.authenticate('local')(req,res, function(){
				return res.status(200).json({status : 'Registration was successfull'});
			});
		});
	});
	
});

router.post('/login', function(req, res, next){
    //console.log(req.body);
    passport.authenticate('local', function(err, doctor, info){
		if(err){
			return next(err);
		}
		if(!doctor){
            console.log("no doctor data");
			return res.status(401).json({err : info});
		}
		
		req.logIn(doctor, function(err){
			if(err){
                console.log(err);
                console.log("login failed");
				return res.status(500).json({
					err : 'unable to login user'
				});
			}
			var token = Verify.getToken(doctor);
			res.status(200).json({
				status : 'Login Successsful',
				token : token,
                id: doctor._id,
                username: doctor.username,

				success : true
			});
		});
	})(req,res,next);
});

router.get('/logout', function(req,res){
	req.logout();
	res.status(200).json({
		status : 'Bye'
	});
});

router.get('/me' , Verify.verifyDoctor , (req,res) => {
    res.json(req.doctor);
});

router.post('/me', Verify.verifyDoctor , (req,res) => {
    //console.log(req.body.body);
    var requestBody = req.body.body;
    var doctor = req.doctor;
    //console.log(doctor)
    Doctor.findByIdAndUpdate(doctor._doc._id,{
        $set : {firstname: requestBody.firstName,
        lastname : requestBody.lastName,
        address : requestBody.address,
        email: requestBody.email,
        phone: requestBody.phone,
        dob: requestBody.dob,
        gender: requestBody.gender,
        emergencyContacts: requestBody.emergencyContacts
    }
    },{ new: true}).exec((err,item) => {
        if(err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the item with id: ' + doctor._id);
    })
});

router.post('/patientSearch', Verify.verifyDoctor , (req,res) => {
    var requestBody = req.body.body;
    Patient.findById(requestBody.patientId, (err,patient) => {
        if (err) throw err;
        //console.log("printing medical data "+patient.medicalData)
    var responseData = patient;
    try{
    responseData.medicalData.eyesight = responseData.medicalData.eyesight[responseData.medicalData.eyesight.length -1];
    weightData = responseData.medicalData.weight[responseData.medicalData.weight.length -1].value;
    //console.log("weight"+weightData);
    responseData.medicalData.weight = { value : weightData.split(" ")[0]}
    //console.log(responseData.medicalData.weight)
    //console.log("Length : "+weightData.split(" ").length)
    if(weightData.split(" ").length > 1){
        console.log("inside");
        responseData.medicalData.weightscale = {value:weightData.split(" ")[1]}
        console.log(responseData.medicalData.weightscale.value)
    }
    height = responseData.medicalData.height[responseData.medicalData.height.length -1].value;
    responseData.medicalData.height = { value:height.split(" ")[0]}
    if(height.split(" ").length > 1)
        responseData.medicalData.heightscale = {value :height.split(" ")[1]}
    responseData.medicalData.sugarlevel = { value: responseData.medicalData.sugarlevel[responseData.medicalData.sugarlevel.length -1].value}
    responseData.medicalData.cholestrol = {value: responseData.medicalData.cholestrol[responseData.medicalData.cholestrol.length -1].value}
    responseData.medicalData.respiration = {value: responseData.medicalData.respiration[responseData.medicalData.respiration.length -1].value}
    responseData.medicalData.pulse = { value:responseData.medicalData.pulse[responseData.medicalData.pulse.length -1].value}
    responseData.medicalData.bloodpressure = {value:responseData.medicalData.bloodpressure[responseData.medicalData.bloodpressure.length -1].value}
    var temp = responseData.medicalData.temperature[responseData.medicalData.temperature.length -1].value;
    responseData.medicalData.temperature = {value:temp.split(" ")[0]}
    if(temp.split(" ").length > 1)
        responseData.medicalData.tempscale = {value:temp.split(" ")[1]}
    } catch(e){
        console.log("error occurred "+e);
    }
        res.json(responseData);
    })
})
router.get('/getPrescription/:patientId' , Verify.verifyDoctor , (req,res) => {
    //console.log( req.doctor._doc);
    var patientData = req.params.patientId ;
    var doctorId = req.doctor._doc._id;
   // console.log(patientData + " " + doctorId);
    Patient.findById(patientData).populate('prescriptions.doctorId').exec( (err,patient) => {
        //console.log(patient.populate('prescriptions.doctorId'));
       // prescriptionData = patient;
       // console.log(patient.populate('prescriptions.doctorId'))
       /* for(i = 0 ; i < patient.prescriptions.length ; i++){
            console.log(patient.prescriptions[i].doctorId); 
        }*/
        prescriptionData = patient.prescriptions;
       // console.log(prescriptionData);
        //console.log("prescription data "+prescriptionData);
        prescriptionsFromDoc = [];
        for(let prescription of prescriptionData){
                //data = prescription.populate('prescription.doctorId');
               // console.log(data);
                //console.log("pushing prescription")
                delete prescription.doctorId.password;
                prescriptionsFromDoc.push(prescription);
            
        }
        res.json(prescriptionsFromDoc);
    })
})
router.post('/postPrescription', Verify.verifyDoctor , (req,res) => {
    var requestBody = req.body.body;
    //console.log(req.doctor)
    requestBody.doctorId = req.doctor._doc._id;
    //delete requestBody.patientId

    Patient.findById(requestBody.patientId, (err,patient) => {
        if (err) throw err; 
        delete requestBody.patientId 
        console.log("about to update");     
        patient.prescriptions.push(requestBody);
        patient.save(function (err, patient) {
            if (err) throw err;
            console.log('Updated prescriptions!');
           // res.json(patient.prescription);
        prescriptionData = patient.populate('prescriptions.doctorId').prescriptions;
        //console.log("prescription data "+prescriptionData);
        prescriptionsFromDoc = [];
        for(let prescription of prescriptionData){
            if(prescription.doctorId == req.doctor._doc._id){
                console.log("pushing prescription")
                prescriptionsFromDoc.push(prescription);
            }
        }
        res.json(prescriptionsFromDoc);

        });
    })
})


module.exports = router;
