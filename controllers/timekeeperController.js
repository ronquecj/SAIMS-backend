const RenderHour = require('../models/RenderHour');
const User = require('../models/User');

const getRenderHours = async (req, res) => {
    const { month, cutoffPeriod } = req.query;
    try {
        const records = await RenderHour.find({ month, cutoffPeriod }).populate('studentAssistant', 'fullName office profilePicture');
        res.json(records);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveRenderHours = async (req, res) => {
    const { month, cutoffPeriod, records } = req.body;
    try {
        for (let record of records) {
            await RenderHour.findOneAndUpdate(
                { month, cutoffPeriod, studentAssistant: record.studentAssistant },
                { hours: record.hours },
                { upsert: true, new: true }
            );
        }
        res.json({ message: 'Render hours saved successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getRenderHours, saveRenderHours };