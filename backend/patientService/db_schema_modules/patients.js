// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcryptjs');
var Promise = require('Promise');
const SALT_WORK_FACTOR = 10;


var prescriptionSchema = new Schema({
    diagnosis : {
        briefDiagnosis : {type : String , required : true},
        detailedDiagnosis : {type : String , required : true}
    },
    treatment : {
        briefTreatment : {type : String , required : true},
        detailedTreatment : {type : String , required : true}
    },
    medicine: {
        medicineArray :[{
            medicinename:{ type:String},
            morning:{ type: Boolean},
            afternoon:{ type: Boolean},
            evening:{ type: Boolean},
            night:{ type: Boolean},
            duriation: { type: String }
        }]
    },
    labprescription : {

    },
    nextappointment : {

    },
    doctorId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }
}, {
    timestamps: true
});


// create a schema
var patientSchema = new Schema({
    firstname: {
        type: String
        //required: true,
        
    },
    lastname: {
        type: String
        //required: true,
        
    },
    username: {
        type: String
       // required: true,
    },
    password: {
        type: String
        //required: true,
    },
    address: {
        country: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true }
    },
    email: {
        type: String,
        required: true,
    },

    photo: {
         type: Buffer,
    },
    phone: {
        type: String,
        required: true,
    },
    idproof: Buffer,
    
    dob: Date,

    gender: String,

    emergencyContacts: [{
        emergencyContactName:{ type:String},
        emergencyContactPhone:{ type: String}
    }],

    prescriptions:[prescriptionSchema],

    medicalData: {
        bloodgroup: {type:String},
        

        weight : [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }
            ],

            height : [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }
        ],

        temperature:[{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        bloodpressure:[{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        pulse: [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        respiration: [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        cholestrol: [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        sugarlevel : [{ value: String ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],

        eyesight :[{ rightEyesight: String ,
                     leftEyesight : String  ,
                    docId:{   type: mongoose.Schema.Types.ObjectId,
                              ref: 'Doctor'
                          },
                    createdAt : { type : Date, index: true }
                }],
    },

    primaryDoctorName: String,

    uploadHistory: [{type:Buffer}]
    
}, {
    timestamps: true
});

function bcryptData(){

    return new Promise(function (fulfill, reject){
       bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        else fulfill(salt);
      });
    });

}

patientSchema.pre('save', function(next) {
    var patient = this;

    // only hash the password if it has been modified (or is new)
    if (!patient.isModified('password')) return next();

    // generate a salt
    bcryptData().then(function(salt){
        return new Promise(function(fulfill, reject){
             bcrypt.hash(patient.password, salt, function(err, hash) {
                 if(err) return next(err);
                 patient.password = hash;
                 next();
             });
        })
    }).catch(function(err){
        console.log("error occurred in promise");
        console.log(err);
    })

});

patientSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

patientSchema.plugin(passportLocalMongoose);
// the schema is useless so far
// we need to create a model using it
var Patient = mongoose.model('Patient', patientSchema);

// make this available to our Node applications
module.exports = Patient;