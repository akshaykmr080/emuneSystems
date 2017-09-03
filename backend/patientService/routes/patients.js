var express = require('express');
var router = express.Router();
var passport = require('passport');
var Patient = require('../db_schema_modules/patients');
var Verify    = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res){


    var patient = new Patient({username : req.body.username , password : req.body.password});
    
    if(req.body.firstName) {
            patient.firstname = req.body.firstName;
        }
        if(req.body.lastName) {
            patient.lastname = req.body.lastName;
        }

        if(req.body.address){
            if(req.body.address.country){
                patient.address.country = req.body.address.country;
            }
            if(req.body.address.city){
                patient.address.city = req.body.address.city;
            }
            if(req.body.address.zip){
                patient.address.zip = req.body.address.zip;
            }
            if(req.body.address.street){
                patient.address.street = req.body.address.street;
            }
        }

        if(req.body.email){
            patient.email = req.body.email;
        }
		
        if(req.body.photo){
            patient.photo = req.body.photo;
        }
        if(req.body.phone){
            patient.phone = req.body.phone;
        }
        if(req.body.file){
            console.log("about to update id");
            patient.idproof = req.body.file;
        }

	Patient.register(patient, req.body.password, function(err, patientData){
		if(err){
            console.log("error occurred "+err);
			return res.status(500).json({err : err});
		}
		

		patientData.save(function(err,patient){
			passport.authenticate('local')(req,res, function(){
				return res.status(200).json({status : 'Registration was successfull'});
			});
		});
	});
	
});

router.post('/login', function(req, res, next){
    //console.log(req.body);
    passport.authenticate('local', function(err, patient, info){
		if(err){
			return next(err);
		}
		if(!patient){
            console.log("no patient data");
			return res.status(401).json({err : info});
		}
		
		req.logIn(patient, function(err){
			if(err){
                console.log(err);
                console.log("login failed");
				return res.status(500).json({
					err : 'unable to login user'
				});
			}
			var token = Verify.getToken(patient);
			res.status(200).json({
				status : 'Login Successsful',
				token : token,
                id: patient._id,
                username: patient.username,

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

router.get('/me' , Verify.verifyPatient , (req,res) => {
    
    res.json(req.patient);
});

router.post('/me', Verify.verifyPatient , (req,res) => {
    //console.log(req.body.body);
    var requestBody = req.body.body;
    var patient = req.patient;
    //console.log(patient)
    //console.log(requestBody.emergencyContacts);
    Patient.findByIdAndUpdate(patient._doc._id,{
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
        res.end('Added the item with id: ' + patient._id);
    })
});

//save patients medical data. The data which patient updates himself 
router.post('/medicalData' , Verify.verifyPatient , (req,res)=> {
   // console.log(req);
   var requestBody = req.body.body;
    var patient = req.patient;
    //console.log(patient)
    //console.log(requestBody.emergencyContacts);
    Patient.findById(patient._doc._id, function (err, patient){
        patient.medicalData.bloodgroup = requestBody.bloodGroup;
        //Height
        if(patient.medicalData.height.length > 0 &&  patient.medicalData.height[patient.medicalData.height.length - 1].value != ''){
            if(patient.medicalData.height[patient.medicalData.height.length - 1].value !== requestBody.height){
                //console.log("reached 1 - adding data")
                patient.medicalData.height.push({value:requestBody.height+" "+requestBody.heightscale,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.height.push({value:requestBody.height+" "+requestBody.heightscale,docId:requestBody.docId,createdAt: new Date()})
        }

        //Weight
        if(patient.medicalData.weight.length > 0 &&  patient.medicalData.weight[patient.medicalData.weight.length - 1].value != ''){
            if(patient.medicalData.weight[patient.medicalData.weight.length - 1].value !== requestBody.weight){
                //console.log("reached 1 - adding data")
                patient.medicalData.weight.push({value:requestBody.weight+" "+requestBody.weightscale,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.weight.push({value:requestBody.weight+" "+requestBody.weightscale,docId:requestBody.docId,createdAt: new Date()})
        }

        //Body temp
        if(patient.medicalData.temperature.length > 0 &&  patient.medicalData.temperature[patient.medicalData.temperature.length - 1].value != ''){
            if(patient.medicalData.temperature[patient.medicalData.temperature.length - 1].value !== requestBody.temperature){
                //console.log("reached 1 - adding data")
                patient.medicalData.temperature.push({value:requestBody.temperature+" "+requestBody.tempscale,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.temperature.push({value:requestBody.temperature+" "+requestBody.tempscale,docId:requestBody.docId,createdAt: new Date()})
        }

        //blood pressure
        if(patient.medicalData.bloodpressure.length > 0 &&  patient.medicalData.bloodpressure[patient.medicalData.bloodpressure.length - 1].value != ''){
            if(patient.medicalData.bloodpressure[patient.medicalData.bloodpressure.length - 1].value !== requestBody.bloodpressure){
                //console.log("reached 1 - adding data")
                console.log("reached blood pressure 1");
                patient.medicalData.bloodpressure.push({value:requestBody.bloodpressure+" "+requestBody.weightscale,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            console.log("reached blood pressure 2");
            patient.medicalData.bloodpressure.push({value:requestBody.bloodpressure+" "+requestBody.weightscale,docId:requestBody.docId,createdAt: new Date()})
        }
        //pulse rate
        if(patient.medicalData.pulse.length > 0 &&  patient.medicalData.pulse[patient.medicalData.pulse.length - 1].value != ''){
            if(patient.medicalData.pulse[patient.medicalData.pulse.length - 1].value !== requestBody.pulse){
                //console.log("reached 1 - adding data")
                patient.medicalData.pulse.push({value:requestBody.pulse,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.pulse.push({value:requestBody.pulse,docId:requestBody.docId,createdAt: new Date()})
        }

        //respiration
        if(patient.medicalData.respiration.length > 0 &&  patient.medicalData.respiration[patient.medicalData.respiration.length - 1].value != ''){
            if(patient.medicalData.respiration[patient.medicalData.respiration.length - 1].value !== requestBody.respiration){
                //console.log("reached 1 - adding data")
                patient.medicalData.respiration.push({value:requestBody.respiration,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.respiration.push({value:requestBody.respiration,docId:requestBody.docId,createdAt: new Date()})
        }

        //cholestrol
        if(patient.medicalData.cholestrol.length > 0 &&  patient.medicalData.cholestrol[patient.medicalData.cholestrol.length - 1].value != ''){
            if(patient.medicalData.cholestrol[patient.medicalData.cholestrol.length - 1].value !== requestBody.cholestrol){
                //console.log("reached 1 - adding data")
                patient.medicalData.cholestrol.push({value:requestBody.cholestrol,docId:requestBody.docId,createdAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.cholestrol.push({value:requestBody.cholestrol,docId:requestBody.docId,createdAt: new Date()})
        }

        //sugar level
        if(patient.medicalData.sugarlevel.length > 0 &&  patient.medicalData.sugarlevel[patient.medicalData.sugarlevel.length - 1].value != ''){
            if(patient.medicalData.sugarlevel[patient.medicalData.sugarlevel.length - 1].value !== requestBody.sugarlevel){
                //console.log("reached 1 - adding data")
                patient.medicalData.sugarlevel.push({value:requestBody.sugarlevel,docId:requestBody.docId,createdAt: new Date(), updatedAt: new Date()})
            }
        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.sugarlevel.push({value:requestBody.sugarlevel,docId:requestBody.docId,createdAt: new Date(), updatedAt: new Date()})
        }

        //eye sight
        if(patient.medicalData.eyesight.length > 0 &&  patient.medicalData.eyesight[patient.medicalData.eyesight.length - 1].value != ''){
            if(patient.medicalData.eyesight[patient.medicalData.eyesight.length - 1].rightEyesight !== requestBody.rightEyesight){
                //console.log("reached 1 - adding data")
                patient.medicalData.eyesight.push({rightEyesight:requestBody.rightEyesight,leftEyesight: requestBody.leftEyesight ,docId:requestBody.docId,createdAt: new Date()})
            }

        } else {
            //console.log("reached 2 - inserting first time")
            patient.medicalData.eyesight.push({rightEyesight:requestBody.rightEyesight,leftEyesight: requestBody.leftEyesight ,docId:requestBody.docId,createdAt: new Date()})
        }

        //
        patient.save();
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Updated patient with ID ' + patient._id);

    });

})

router.get('/medicalData' , Verify.verifyPatient , (req,res)=> {
    medicalData = req.patient.medicalData;
    personweight =  medicalData.weight.length > 0 ? medicalData.weight[medicalData.weight.length - 1] .value: "";
    weightdata = weight.split(" ")[0];
    weightscale = weight.split(" ")[1];
    personheight =  medicalData.height.length > 0 ? medicalData.height[medicalData.height.length - 1].value : "";
    heightdata = personheight.split(" ")[0];
    heightscale = personheight.split(" ")[1];
    temp =  medicalData.temperature.length > 0 ?  medicalData.temperature[medicalData.temperature.length -1].value : "";
    tempdata = weight.split(" ")[0];
    tempscale = weight.split(" ")[1];
    bloodpressuredata = medicalData.bloodpressure.length > 0 ? medicalData.bloodpressure[medicalData.bloodpressure.length -1].value : "";
    pulserate = medicalData.pulse.length > 0 ? medicalData.pulse[medicalData.pulse.length -1].value : "";
    respirationdata = medicalData.respiration.length > 0 ? medicalData.respiration[medicalData.respiration.length -1].value : "";
    cholestroldata = medicalData.cholestrol.length > 0 ? medicalData.cholestrol[medicalData.cholestrol.length -1].value : "";
    sugardata = medicalData.sugarlevel.length > 0 ? medicalData.sugarlevel[medicalData.sugarlevel.length -1].value : "";
    righteyesight = medicalData.eyesight.length > 0 ? medicalData.eyesight[medicalData.eyesight.length -1].rightEyesight : "";
    lefteyesight = medicalData.eyesight.length > 0 ? medicalData.eyesight[medicalData.eyesight.length -1].leftEyesight : "";


    responseData = {
        bloodgroup: medicalData.bloodgroup,
        bloodpressure : bloodpressuredata,
        weight : weightdata,
        weightscale : weightscale,
        height : heightdata,
        heightscale : heightscale,
        temperature : tempdata,
        tempscale : tempscale,
        pulse : pulserate,
        respiration : respirationdata,
        cholestrol : cholestroldata,
        sugarlevel : sugardata,
        righteye : righteyesight,
        lefteye : lefteyesight
    }

    res.json(responseData);
    
})

module.exports = router;
