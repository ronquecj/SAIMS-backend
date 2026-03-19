const Allowance = require('../models/Allowance');
const RenderHour = require('../models/RenderHour');
const User = require('../models/User');

const getVerificationList = async (req, res) => {
    const { month, cutoffPeriod } = req.query;
    try {  
        const students = await User.find({ role: { $in: ['Student Assistant', 'EOSA'] }, isActive: true }).select('fullName office');
        const renderRecords = await RenderHour.find({ month, cutoffPeriod }); 
        const allowanceRecords = await Allowance.find({ month, cutoffPeriod });
        
        const data = students.map(student => {
            const render = renderRecords.find(r => r.studentAssistant.toString() === student._id.toString());
            const allowance = allowanceRecords.find(a => a.studentAssistant.toString() === student._id.toString());
            return {
                student: student,
                hours: render ? render.hours : 0,
                minutes: render ? render.minutes : 0,
                isEligible: allowance ? allowance.isEligible : false,
                allowanceId: allowance ? allowance._id : null,
                documentUrl: allowance ? allowance.documentUrl : null
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
                { isEligible: rec.isEligible, status: 'Pending', documentUrl: rec.documentUrl },
                { upsert: true }
            );
            
            if (rec.isEligible) {
                const studentUser = await User.findById(rec.studentAssistant);
                let updates = {
                    $push: { notifications: { message: `You are marked Eligible for allowance for ${month} - ${cutoffPeriod}.` } }
                };
                
                if (studentUser.leaveBalance < 0) {
                    updates.$set = { leaveBalance: 0 };
                }
                await User.findByIdAndUpdate(rec.studentAssistant, updates);
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