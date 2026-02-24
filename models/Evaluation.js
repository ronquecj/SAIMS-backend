const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    ratings: {
        punctuality: { type: Number, required: true },
        performance: { type: Number, required: true },
        conduct: { type: Number, required: true }
    },
    comments: { type: String },
    semester: { type: String, default: '2nd Semester' },
    schoolYear: { type: String, default: '2025-2026' }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);