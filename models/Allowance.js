const mongoose = require('mongoose');
const allowanceSchema = new mongoose.Schema({
    month: String,
    cutoffPeriod: String,
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isEligible: Boolean,
    status: { type: String, enum: ['Pending', 'Received'], default: 'Pending' },
    documentUrl: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Allowance', allowanceSchema);