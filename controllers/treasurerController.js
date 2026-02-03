const User = require('../models/User');
 
const MIN_HOURS_FOR_ELIGIBILITY = 40;
 
const getStudentsForVerification = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student Assistant' }).select('fullName email renderHours isEligibleForAllowance');
     
    const studentsWithEligibility = students.map(student => ({
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
      renderHours: student.renderHours,
      isEligibleForAllowance: student.isEligibleForAllowance,  
      metMinimumHours: student.renderHours >= MIN_HOURS_FOR_ELIGIBILITY, 
    }));
    
    res.json(studentsWithEligibility);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const updateAllowanceEligibility = async (req, res) => {
  const { isEligible } = req.body;
  const { studentId } = req.params;

  if (typeof isEligible !== 'boolean') {
    return res.status(400).json({ message: 'Eligibility status (boolean) is required.' });
  }

  try {
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'Student Assistant') {
      return res.status(404).json({ message: 'Student Assistant not found.' });
    }
    
    student.isEligibleForAllowance = isEligible;
    await student.save();

    res.json({ 
        message: 'Eligibility status updated successfully', 
        fullName: student.fullName, 
        isEligible: student.isEligibleForAllowance 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const getAllowanceHistory = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student Assistant' }).select('fullName allowanceHistory');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
const recordPayment = async (req, res) => {
  const { cutoffDate, amount, status } = req.body;  
  const { studentId } = req.params;
  
  if (!cutoffDate || !amount || !status) {
    return res.status(400).json({ message: 'Cutoff date, amount, and status are required.' });
  }

  try {
    const student = await User.findByIdAndUpdate(
        studentId,
        {
            $push: {
                allowanceHistory: {
                    cutoffDate: new Date(cutoffDate),
                    amount: Number(amount),
                    status,
                }
            }
        },
        { new: true, select: 'fullName allowanceHistory' }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student Assistant not found.' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStudentsForVerification,
  updateAllowanceEligibility,
  getAllowanceHistory,
  recordPayment,
};