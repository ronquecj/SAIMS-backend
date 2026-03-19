const User = require('../models/User');
 
const getStudentAssistants = async (req, res) => {
  try { 
    const students = await User.find({ role: { $in: ['Student Assistant', 'EOSA'] } }).select('-password').populate('assignedFaculty', 'fullName');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const getFacultyAndAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: { $in:['Faculty', 'Admin'] } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const assignFaculty = async (req, res) => {
  const { studentId, facultyId, office } = req.body;

  try {
    const student = await User.findById(studentId);
     
    if (student.isActive === false) {
        return res.status(400).json({ message: 'Cannot assign an inactive Student Assistant.' });
    } 

    student.assignedFaculty = facultyId;
    if (office) student.office = office;
    await student.save();
    res.json({ message: 'Assignment successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateRenderHours = async (req, res) => {
  const { hours } = req.body;
  const { studentId } = req.params;

  if (hours === undefined || hours < 0) {
    return res.status(400).json({ message: 'Valid hours value is required.' });
  }

  try {
    const student = await User.findById(studentId).select('-password');
    
    if (!student || !['Student Assistant', 'EOSA'].includes(student.role)) {
      return res.status(404).json({ message: 'Student Assistant not found.' });
    }
     
    student.renderHours = hours; 
    await student.save();

    res.json({ 
        message: 'Render hours updated successfully', 
        fullName: student.fullName, 
        renderHours: student.renderHours 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userToFind = await User.findById(req.params.id).select('-password');
    
    if (!userToFind) {
        return res.status(404).json({ message: 'User not found' });
    }
     
    const isAuthorized = req.user.role === 'Admin' || req.user._id.toString() === userToFind._id.toString();
     
    if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to view this user profile.' });
    }

    res.json(userToFind);
  } catch (error) { 
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found with that ID format.' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 

const updateProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user._id).select('-password');
      if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;
      if (req.body.biodata) user.biodata = req.body.biodata;
      if (req.body.department) user.department = req.body.department;
      if (req.body.position) user.position = req.body.position;
      if (req.body.fullName) user.fullName = req.body.fullName;
      await user.save();
      res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const readNotifications = async (req, res) => {
  try {
      const user = await User.findById(req.user._id).select('-password');
      user.notifications.forEach(n => n.isRead = true);
      await user.save();
      res.json(user.notifications);
  } catch (error) { 
      res.status(500).json({ message: error.message }); 
  }
};

const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own administrator account' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: `Account for ${userToDelete.fullName} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStudentAssistants,
  getFacultyAndAdmin,
  assignFaculty,
  updateRenderHours,
  getUserById,
  updateProfile,
  readNotifications,
  deleteUser
};