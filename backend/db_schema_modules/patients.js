// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var patientSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        
    },
    lastName: {
        type: String,
        required: true,
        
    },
    userName: {
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
         required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: Date,

    gender: String,

    emergencyContacts: [{type:String}],

    bloodGroup: String,

    height: Number,

    weight: Number,

    primaryDoctorName: String,

    uploadHistory: [{type:Buffer}]
    
}, {
    timestamps: true
});

patientSchema.pre('save', function(next) {
    var patient = this;

    // only hash the password if it has been modified (or is new)
    if (!patient.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(patient.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            patient.password = hash;
            next();
        });
    });
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