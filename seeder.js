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
    await User.deleteMany(); 
    await Announcement.deleteMany(); 
    await LeaveRequest.deleteMany(); 
    await MeetingMinute.deleteMany(); 
    await RenderHour.deleteMany(); 
    await Allowance.deleteMany(); 
    await Offense.deleteMany(); 
    await PresidentReport.deleteMany();
 
    const salt = await bcrypt.genSalt(10);
    const hashPw = async (pw) => await bcrypt.hash(pw, salt);
 
    const usersData = [
      // Admin
      { fullName: 'Global Admin', email: 'admin@saims.com', password: await hashPw('password123'), role: 'Admin', subRole: 'None', office: 'Admin Office' },
       
      // Faculty
      { fullName: 'Dr. Jane Smith', email: 'jane.smith@saims.com', password: await hashPw('password123'), role: 'Faculty', subRole: 'None', office: 'Dean\'s Office' },
      
      // Officers
      { fullName: 'Juan Dela Cruz', email: 'juan.cruz@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'President', office: 'President\'s Office', renderHours: 45, leaveBalance: 25 },
      { fullName: 'Maria Clara', email: 'maria.clara@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Secretary', office: 'Registrar', renderHours: 42, leaveBalance: 25 },
      { fullName: 'Emilio Aguinaldo', email: 'emilio.aguinaldo@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Treasurer', office: 'Accounting Office', renderHours: 50, leaveBalance: 25 },
      { fullName: 'Andres Bonifacio', email: 'andres.bonifacio@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'Timekeeper', office: 'HR Office', renderHours: 40, leaveBalance: 25 },
      
      // Regular SA
      { fullName: 'Jose Rizal', email: 'jose.rizal@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'Library', renderHours: 35, leaveBalance: 25 },
      { fullName: 'Gabriela Silang', email: 'gabriela.silang@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'IT Department', renderHours: 60, leaveBalance: 25 },
      
      // EOSA
      { fullName: 'Apolinario Mabini', email: 'apolinario@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'None', office: 'Adviser Office' }
    ];

    const createdUsers = await User.insertMany(usersData);
     
    const pres = createdUsers.find(u => u.subRole === 'President');
    const sec = createdUsers.find(u => u.subRole === 'Secretary');
    const tk = createdUsers.find(u => u.subRole === 'Timekeeper');
    const rizal = createdUsers.find(u => u.fullName === 'Jose Rizal');
    const silang = createdUsers.find(u => u.fullName === 'Gabriela Silang');
    const facultySmith = createdUsers.find(u => u.email === 'jane.smith@saims.com');
 
    await User.findByIdAndUpdate(rizal._id, { assignedFaculty: facultySmith._id });
    await User.findByIdAndUpdate(pres._id, { assignedFaculty: facultySmith._id });
 
    await Announcement.insertMany([
        { title: 'Mandatory Seminar', content: 'All SA officers must attend the seminar.', author: pres._id, authorName: pres.fullName, audience: 'Student Assistants' },
        { title: 'Library Renovation', content: 'Library is closed tomorrow.', author: sec._id, authorName: sec.fullName, audience: 'All' }
    ]);
 
    await LeaveRequest.insertMany([
        { studentAssistant: rizal._id, reason: 'Sickness, high fever.', date: new Date('2026-03-01'), hoursRequested: 8, status: 'Pending' },
        { studentAssistant: pres._id, reason: 'Personal emergency.', date: new Date('2026-03-05'), hoursRequested: 4, status: 'Approved', comment: 'Approved by Timekeeper.' }
    ]);
 
    await MeetingMinute.insertMany([
        { title: 'January Planning', date: new Date('2026-01-15'), content: 'Discussed budget.', createdBy: sec._id, status: 'Approved', adminComment: 'Looks good.' },
        { title: 'February Emergency Meeting', date: new Date('2026-02-10'), content: 'Review allowance process.', createdBy: sec._id, status: 'Pending' }
    ]);
 
    await RenderHour.insertMany([
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: pres._id, hours: 45 },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: rizal._id, hours: 35 },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: silang._id, hours: 60 }
    ]);

    await Allowance.insertMany([
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: pres._id, isEligible: true, status: 'Received' },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: rizal._id, isEligible: false, status: 'Pending' },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: silang._id, isEligible: true, status: 'Pending' }
    ]);
 
    await Offense.insertMany([
        { studentAssistant: rizal._id, date: new Date('2026-02-10'), description: 'Late for 3 consecutive days without notice.', isResolved: false },
        { studentAssistant: silang._id, date: new Date('2026-01-05'), description: 'Forgot to lock IT lab after shift.', isResolved: true }
    ]);

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
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};
 
if (process.argv[2] === '-d') destroyData(); else importData();