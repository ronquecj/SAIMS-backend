const Allowance = require('../models/Allowance');
const RenderHour = require('../models/RenderHour');
const User = require('../models/User');

const getVerificationList = async (req, res) => {
    const { month, cutoffPeriod } = req.query;
    try { 
        const renderRecords = await RenderHour.find({ month, cutoffPeriod }).populate('studentAssistant', 'fullName office'); 
        const allowanceRecords = await Allowance.find({ month, cutoffPeriod });
        
        const data = renderRecords.map(render => {
            const allowance = allowanceRecords.find(a => a.studentAssistant.toString() === render.studentAssistant._id.toString());
            return {
                student: render.studentAssistant,
                hours: render.hours,
                isEligible: allowance ? allowance.isEligible : false,
                allowanceId: allowance ? allowance._id : null
            };
        });
        res.json(data);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveVerification = async (req, res) => {
    const { month, cutoffPeriod, records } = req.body;
    try {
        for (let rec of records) {
            await Allowance.findOneAndUpdate(
                { month, cutoffPeriod, studentAssistant: rec.studentAssistant },
                { isEligible: rec.isEligible, status: 'Pending' },
                { upsert: true }
            );
            if(rec.isEligible) {
                await User.findByIdAndUpdate(rec.studentAssistant, {
                    $push: { notifications: { message: `You are marked Eligible for allowance for ${month} - ${cutoffPeriod}.` } }
                });
            }
        }
        res.json({ message: 'Verification saved' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getHistoryList = async (req, res) => {
    const { month, cutoffPeriod } = req.query;
    try {
        const records = await Allowance.find({ month, cutoffPeriod }).populate('studentAssistant', 'fullName');
        res.json(records);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateHistoryStatus = async (req, res) => {
    const { allowanceId, status } = req.body;
    try {
        await Allowance.findByIdAndUpdate(allowanceId, { status });
        res.json({ message: 'Status updated' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getVerificationList, saveVerification, getHistoryList, updateHistoryStatus };