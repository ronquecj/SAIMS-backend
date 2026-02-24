const mongoose = require('mongoose');
const leaveRequestSchema = new mongoose.Schema({
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
    hoursRequested: { type: Number, required: true },
    documentUrl: { type: String }, 
    status: { type: String, required: true, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
    comment: { type: String }, 
}, { timestamps: true });
module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);