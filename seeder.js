const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); 
const bcrypt = require('bcryptjs');
 
const connectDB = require('./config/db');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const LeaveRequest = require('./models/LeaveRequest');  
const MeetingMinute = require('./models/MeetingMinute');  
const RenderHour = require('./models/RenderHour');
const Allowance = require('./models/Allowance');
const Offense = require('./models/Offense');
const PresidentReport = require('./models/PresidentReport');

dotenv.config();
connectDB();

const importData = async () => {
  try {  
    await User.deleteMany(); await Announcement.deleteMany(); await LeaveRequest.deleteMany(); await MeetingMinute.deleteMany(); await RenderHour.deleteMany(); await Allowance.deleteMany(); await Offense.deleteMany(); await PresidentReport.deleteMany();
 
    const salt = await bcrypt.genSalt(10);
    const hashPw = async (pw) => await bcrypt.hash(pw, salt);

    const usersData = [
      { fullName: 'Global Admin', email: 'admin@saims.com', password: await hashPw('password123'), role: 'Admin', subRole: 'None' },
      { fullName: 'Dr. Jane Smith', email: 'jane.smith@saims.com', password: await hashPw('password123'), role: 'Faculty', subRole: 'None' },
      { fullName: 'Juan Dela Cruz', email: 'juan.cruz@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'President', office: 'President\'s Office', renderHours: 45, leaveBalance: 25 },
      { fullName: 'Maria Clara', email: 'maria.clara@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Secretary', office: 'Registrar', renderHours: 42, leaveBalance: 25 },
      { fullName: 'Emilio Aguinaldo', email: 'emilio.aguinaldo@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Treasurer', office: 'Accounting', renderHours: 50, leaveBalance: 25 },
      { fullName: 'Andres Bonifacio', email: 'andres.bonifacio@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Timekeeper', office: 'HR', renderHours: 40, leaveBalance: 25 },
      { fullName: 'Jose Rizal', email: 'jose.rizal@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'Library', renderHours: 35, leaveBalance: 25 },
      { fullName: 'Apolinario Mabini', email: 'apolinario@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'None', office: 'Adviser Office' }
    ];

    const createdUsers = await User.insertMany(usersData);
    
    const sec = createdUsers.find(u => u.subRole === 'Secretary');

    // DEFAULT MEETING MINUTE ADDED HERE
    await MeetingMinute.create({
        title: 'Initial Officers Briefing - Feb 2026',
        date: new Date('2026-02-05'),
        content: 'Discussed the transition to the new SAIMS system. All officers are required to test their respective modules. Treasurer confirmed allowance budgets.',
        createdBy: sec._id,
        status: 'Pending'
    });

    console.log('ALL DATA IMPORTED SUCCESSFULLY!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany(); await Announcement.deleteMany(); await LeaveRequest.deleteMany(); await MeetingMinute.deleteMany(); await RenderHour.deleteMany(); await Allowance.deleteMany(); await Offense.deleteMany(); await PresidentReport.deleteMany();
    console.log('ALL DATA DESTROYED!'.red.inverse);
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};
 
if (process.argv[2] === '-d') destroyData(); else importData();