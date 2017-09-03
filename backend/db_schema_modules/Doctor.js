var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var doctorSchema = new Schema({
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

doctorSchema.pre('save', function(next) {
    var doctor = this;

    // only hash the password if it has been modified (or is new)
    if (!doctor.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(doctor.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            doctor.password = hash;
            next();
        });
    });
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