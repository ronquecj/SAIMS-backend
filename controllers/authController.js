const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, subRole) => {
  return jwt.sign({ id, role, subRole }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
 
const createUserByAdmin = async (req, res) => {
  const { fullName, email, password, role, subRole, office } = req.body;  

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      subRole: role === 'Student Assistant' ? subRole : 'None',
      office: office || 'Unassigned', 
    });

    if (user) {
      res.status(201).json({ _id: user._id, fullName: user.fullName, email: user.email, office: user.office });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subRole: user.subRole, 
        office: user.office || 'Unassigned', 
        profilePicture: user.profilePicture || '', 
        leaveBalance: user.leaveBalance,
        token: generateToken(user._id, user.role, user.subRole),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
 
module.exports = { createUserByAdmin, loginUser };