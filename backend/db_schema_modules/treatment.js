var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var treatmentSchema = new Schema({
    emuneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    treatmentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TreatmentType'
    }
})


var Treatment = mongoose.model('Treatment', treatmentSchema);

// make this available to our Node applications
module.exports = Treatment;