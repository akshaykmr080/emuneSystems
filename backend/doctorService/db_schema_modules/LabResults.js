var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labResults = new Schema({
    emuneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    },
    treatmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment',
    },
    labName: {
        type: String,
        required: true,
    },
    reportStatus: {
        type : String,
        enum : [ 'inProgress', 'Done' ],
    },
    labResult: {
        type : Buffer,
    }
})