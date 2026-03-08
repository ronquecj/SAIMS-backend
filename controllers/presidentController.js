const Offense = require('../models/Offense');
const PresidentReport = require('../models/PresidentReport');
const User = require('../models/User');

const getOffenses = async (req, res) => {
    try { 
        const offenses = await Offense.find({ studentAssistant: req.params.studentId }).populate('studentAssistant', 'fullName office');
        res.json(offenses);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllOffenses = async (req, res) => {
    try { 
        const offenses = await Offense.find({}).populate('studentAssistant', 'fullName office schoolYear semester');
        res.json(offenses);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const addOffense = async (req, res) => {
    try {
        const offense = await Offense.create({ ...req.body, studentAssistant: req.params.studentId });
        res.json(offense);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateOffense = async (req, res) => {
    try {
        const offense = await Offense.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('studentAssistant', 'fullName');
         
        if (req.body.meetingDate && !req.body.isResolved) {
            await User.findByIdAndUpdate(offense.studentAssistant._id, {
                $push: { notifications: { message: `An Admin Meeting has been scheduled for you on ${new Date(req.body.meetingDate).toLocaleDateString()}. Agenda: ${req.body.meetingAgenda}` } }
            });
        }

        res.json(offense);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveReport = async (req, res) => {
    try {
        const report = await PresidentReport.create({ ...req.body, createdBy: req.user._id });
        res.json(report);
    } catch (error) { res.status(500).json({ message: error.message }); }
}

module.exports = { getOffenses, getAllOffenses, addOffense, updateOffense, saveReport };