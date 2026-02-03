const User = require('../models/User');
 
const getStudentAssistants = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student Assistant' }).select('-password').populate('assignedFaculty', 'fullName');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const getFacultyAndAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['Faculty', 'Admin'] } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const assignFaculty = async (req, res) => {
  const { studentId, facultyId } = req.body;

  try {
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role === 'Student Assistant') {
      return res.status(404).json({ message: 'Invalid Faculty/Staff ID' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student Assistant') {
      return res.status(404).json({ message: 'Invalid Student Assistant ID' });
    }

    student.assignedFaculty = facultyId;
    await student.save();

    res.json({ message: 'Assignment successful', student: student.fullName, faculty: faculty.fullName });
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
    
    if (!student || student.role !== 'Student Assistant') {
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

module.exports = {
  getStudentAssistants,
  getFacultyAndAdmin,
  assignFaculty,
  updateRenderHours,
  getUserById,
};