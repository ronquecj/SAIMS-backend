const RenderHour = require('../models/RenderHour');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const getAttendance = async (req, res) => {
    const { semester, month, cutoffPeriod } = req.query;
    try {
        const records = await Attendance.find({ semester, month, cutoffPeriod }).populate('studentAssistant', 'fullName office');
        res.json(records);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveAttendance = async (req, res) => {
    const { semester, month, cutoffPeriod, records } = req.body;
    try {
        for (let rec of records) {
            await Attendance.findOneAndUpdate(
                { semester, month, cutoffPeriod, studentAssistant: rec.studentAssistant },
                { lateMinutes: rec.lateMinutes },
                { upsert: true, new: true }
            );
        }
        res.json({ message: 'Attendance saved successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getRenderHours = async (req, res) => {
    const { month, cutoffPeriod } = req.query;
    try { 
        const students = await User.find({ role: { $in: ['Student Assistant', 'EOSA'] }, isActive: true }).select('fullName office profilePicture');
        const records = await RenderHour.find({ month, cutoffPeriod });
        
        const result = students.map(sa => {
            const record = records.find(r => r.studentAssistant.toString() === sa._id.toString());
            return {
                _id: record ? record._id : sa._id,
                studentAssistant: sa,
                hours: record ? record.hours : 0,
                minutes: record ? record.minutes : 0
            };
        });
        res.json(result);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const saveRenderHours = async (req, res) => {
    const { month, cutoffPeriod, records } = req.body;
    try {
        for (let record of records) {
            await RenderHour.findOneAndUpdate(
                { month, cutoffPeriod, studentAssistant: record.studentAssistant },
                { hours: record.hours, minutes: record.minutes || 0 },
                { upsert: true, new: true }
            );
        }
        res.json({ message: 'Render hours saved successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getRenderHours, saveRenderHours, getAttendance, saveAttendance };