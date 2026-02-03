const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
 
const createLeaveRequest = async (req, res) => {
  const { reason } = req.body;

  if (req.user.role !== 'Student Assistant') {
    return res.status(403).json({ message: 'Only Student Assistants can file leave requests.' });
  }

  if (!reason) {
    return res.status(400).json({ message: 'Reason for leave is required.' });
  }

  try {
    const leaveRequest = await LeaveRequest.create({
      studentAssistant: req.user._id,
      reason,
      status: 'Pending',
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
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
      .populate('studentAssistant', 'fullName email') 
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const updateLeaveStatus = async (req, res) => {
  const { status, denialReason } = req.body;
  
  if (!['Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update value.' });
  }

  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }
     
    request.status = status;
    request.denialReason = status === 'Denied' ? denialReason : undefined;
    
    const updatedRequest = await request.save();
     
    if (status === 'Approved') { 
        await User.findByIdAndUpdate(
            request.studentAssistant, 
            { $inc: { leaveBalance: -1 } }
        );
    }

    res.json(updatedRequest);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveHistory,
  getAllLeaveRequests,
  updateLeaveStatus,
};