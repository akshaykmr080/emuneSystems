var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcryptjs');
var Promise = require('Promise');
const SALT_WORK_FACTOR = 10;

var doctorSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        
    },
    lastname: {
        type: String,
        required: true,
        
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
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
    specialization: String,

    medicalRegNumber: String,

    lisenceNumber: Buffer,

    workLocations: [{
        hospitalName: String,
        city: String,
        street: String,
    }],
    emergencyTimings:{
        from : Date,
        to : Date,
        weekends: Boolean,
    },
    clinicName: String,

    clinicLocation:{
        city: String,
        street: String,
    },

    pharmacies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
    }],

    labs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lab',
    }]



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

doctorSchema.pre('save', function(next) {
    var doctor = this;

    // only hash the password if it has been modified (or is new)
    if (!doctor.isModified('password')) return next();

    // generate a salt
    bcryptData().then(function(salt){
        return new Promise(function(fulfill, reject){
             bcrypt.hash(doctor.password, salt, function(err, hash) {
                 if(err) return next(err);
                 doctor.password = hash;
                 next();
             });
        })
    }).catch(function(err){
        console.log("error occurred in promise");
        console.log(err);
    })
});

doctorSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

doctorSchema.plugin(passportLocalMongoose);
// the schema is useless so far
// we need to create a model using it
var Doctor = mongoose.model('Doctor', doctorSchema);

// make this available to our Node applications
module.exports = Doctor;