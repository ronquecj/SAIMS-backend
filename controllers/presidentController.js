const Offense = require('../models/Offense');
const PresidentReport = require('../models/PresidentReport');

const getOffenses = async (req, res) => {
    try {
        const offenses = await Offense.find({ studentAssistant: req.params.studentId });
        res.json(offenses);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const addOffense = async (req, res) => {
    const { date, description, documentUrl } = req.body;
    try {
        const offense = await Offense.create({ studentAssistant: req.params.studentId, date, description, documentUrl });
        res.json(offense);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleResolved = async (req, res) => {
    try {
        const offense = await Offense.findById(req.params.id);
        offense.isResolved = !offense.isResolved;
        await offense.save();
        res.json(offense);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveReport = async (req, res) => {
    try {
        const report = await PresidentReport.create({ ...req.body, createdBy: req.user._id });
        res.json(report);
    } catch (error) { res.status(500).json({ message: error.message }); }
}
module.exports = { getOffenses, addOffense, toggleResolved, saveReport };