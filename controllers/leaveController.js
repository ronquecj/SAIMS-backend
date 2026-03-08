const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
 
const createLeaveRequest = async (req, res) => {
    const { reason, date, hoursRequested, documentUrl } = req.body;
    try {
        const reqDoc = await LeaveRequest.create({
            studentAssistant: req.user._id, reason, date, hoursRequested, documentUrl
        });
        res.status(201).json(reqDoc);
    } catch (error) { res.status(500).json({ message: error.message }); }
};
 
const getMyLeaveHistory = async (req, res) => {
  try {
    const history = await LeaveRequest.find({ studentAssistant: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const getAllLeaveRequests = async (req, res) => {
  try { 
    const filter = req.query.status ? { status: req.query.status } : {};
     
    const requests = await LeaveRequest.find(filter) 
      .populate('studentAssistant', 'fullName email leaveBalance') 
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const updateLeaveStatus = async (req, res) => {
    const { status, comment } = req.body;
    try {
        const request = await LeaveRequest.findById(req.params.id);
        request.status = status;
        request.comment = comment;
        await request.save();

        const user = await User.findById(request.studentAssistant);
        if (status === 'Approved') {
            user.leaveBalance -= request.hoursRequested;
            user.notifications.push({ message: `Your leave request for ${request.hoursRequested} hours on ${new Date(request.date).toLocaleDateString()} was Approved.` });
        } else {
            user.notifications.push({ message: `Your leave request for ${new Date(request.date).toLocaleDateString()} was Denied. Reason: ${comment}` });
        }
        await user.save();
        res.json(request);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveHistory,
  getAllLeaveRequests,
  updateLeaveStatus,
};