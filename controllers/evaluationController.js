const Evaluation = require('../models/Evaluation');

const submitEvaluation = async (req, res) => {
    const { studentId, ratings, comments } = req.body;
    
    if (!studentId || !ratings) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const evaluation = await Evaluation.create({
            student: studentId,
            faculty: req.user._id,
            ratings,
            comments
        });
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getFacultyHistory = async (req, res) => {
    try {
        const history = await Evaluation.find({ faculty: req.user._id })
            .populate('student', 'fullName office')
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { submitEvaluation, getFacultyHistory };