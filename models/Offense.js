const mongoose = require('mongoose');
const offenseSchema = new mongoose.Schema({
    studentAssistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String,  
    level: String,  
    title: String,
    date: Date,
    description: String,
    documentUrl: String,
    isResolved: { type: Boolean, default: false }, 
    meetingDate: Date,
    meetingAgenda: String,
    meetingSummary: String,
    sanction: String
}, { timestamps: true });
module.exports = mongoose.model('Offense', offenseSchema);