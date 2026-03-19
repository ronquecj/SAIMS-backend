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
const Attendance = require('./models/Attendance'); 
const Evaluation = require('./models/Evaluation');

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
    await Attendance.deleteMany(); 
    await Evaluation.deleteMany();
 
    const salt = await bcrypt.genSalt(10);
    const hashPw = async (pw) => await bcrypt.hash(pw, salt);
  
    const usersData =[ 
      { fullName: 'Global Admin', email: 'admin@saims.com', password: await hashPw('password123'), role: 'Admin', subRole: 'None', office: 'Admin Office' },
        
      { fullName: 'Dr. Jane Smith', email: 'jane.smith@saims.com', password: await hashPw('password123'), role: 'Faculty', subRole: 'None', office: 'Dean\'s Office', department: 'CCS', position: 'Dean' },
       
      { fullName: 'Juan Dela Cruz', email: 'juan.cruz@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'President', office: 'President\'s Office', renderHours: 45, leaveBalance: 25 },
      { fullName: 'Maria Clara', email: 'maria.clara@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'Secretary', office: 'Registrar', renderHours: 42, leaveBalance: 25 },
      { fullName: 'Emilio Aguinaldo', email: 'emilio.aguinaldo@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'Treasurer', office: 'Accounting Office', renderHours: 50, leaveBalance: 25 },
      { fullName: 'Andres Bonifacio', email: 'andres.bonifacio@saims.com', password: await hashPw('password123'), role: 'EOSA', subRole: 'Timekeeper', office: 'HR Office', renderHours: 40, leaveBalance: 25 },
       
      { fullName: 'Jose Rizal', email: 'jose.rizal@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'Library', renderHours: 35, leaveBalance: 25 },
      { fullName: 'Gabriela Silang', email: 'gabriela.silang@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'IT Department', renderHours: 60, leaveBalance: 25 },
      { fullName: 'Apolinario Mabini', email: 'apolinario@saims.com', password: await hashPw('password123'), role: 'Student Assistant', subRole: 'None', office: 'Adviser Office' },
      
      { 
          fullName: 'Juan Inactive', 
          email: 'inactive@saims.com', 
          password: await hashPw('password123'), 
          role: 'Student Assistant', 
          subRole: 'None', 
          office: 'N/A', 
          isActive: false,
          deactivationReason: 'Resigned'
      },
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
        { studentAssistant: rizal._id, reason: 'Sickness, high fever.', date: new Date('2026-03-01'), startTime: '08:00', endTime: '16:00', hoursRequested: 8, status: 'Pending' },
        { studentAssistant: pres._id, reason: 'Personal emergency.', date: new Date('2026-03-05'), startTime: '13:00', endTime: '17:00', hoursRequested: 4, status: 'Approved', comment: 'Approved by Timekeeper.' }
    ]);
  
    await MeetingMinute.insertMany([
        { title: 'January Planning', date: new Date('2026-01-15'), content: 'Discussed budget.', createdBy: sec._id, status: 'Approved', adminComment: 'Looks good.' },
        { title: 'February Emergency Meeting', date: new Date('2026-02-10'), content: 'Review allowance process.', createdBy: sec._id, status: 'Pending' }
    ]);
  
    await Attendance.insertMany([
        { studentAssistant: pres._id, semester: '2nd Semester', month: 'February', cutoffPeriod: '1st Cutoff', lateMinutes: 15 },
        { studentAssistant: rizal._id, semester: '2nd Semester', month: 'February', cutoffPeriod: '1st Cutoff', lateMinutes: 45 },
        { studentAssistant: silang._id, semester: '2nd Semester', month: 'February', cutoffPeriod: '1st Cutoff', lateMinutes: 0 }
    ]);
 
    await RenderHour.insertMany([
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: pres._id, hours: 45, minutes: 30 },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: rizal._id, hours: 35, minutes: 0 },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: silang._id, hours: 60, minutes: 15 }
    ]);

    await Allowance.insertMany([
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: pres._id, isEligible: true, status: 'Received', documentUrl: '/uploads/sample-render.pdf' },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: rizal._id, isEligible: false, status: 'Pending' },
        { month: 'February', cutoffPeriod: '1st Cutoff', studentAssistant: silang._id, isEligible: true, status: 'Pending', documentUrl: '/uploads/sample-render.pdf' }
    ]);
  
    await Offense.insertMany([
        { 
          studentAssistant: rizal._id, category: 'Minor Offense', level: '1st Offense', title: 'Excessive Tardiness', 
          date: new Date('2026-02-10'), description: 'Late for 3 consecutive days without notice.', 
          isResolved: false, meetingDate: new Date('2026-03-10'), meetingAgenda: 'Discuss rendering hours and tardiness.' 
        },
        { 
          studentAssistant: silang._id, category: 'Major Offense', level: '1st Offense', title: 'Negligence of Duty', 
          date: new Date('2026-01-05'), description: 'Forgot to lock IT lab after shift.', 
          isResolved: true, meetingDate: new Date('2026-01-10'), meetingSummary: 'SA apologized and promised to follow closing protocols.', sanction: 'Written Warning' 
        }
    ]);

    await Evaluation.insertMany([
        {
            student: rizal._id,
            faculty: facultySmith._id,
            date: new Date(),
            ratings: { punctuality: 5, performance: 4, conduct: 5 },
            comments: 'Jose is very diligent but needs to ask more questions.',
            semester: '2nd Semester',
            schoolYear: '2025-2026'
        }
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
    await User.deleteMany(); await Announcement.deleteMany(); await LeaveRequest.deleteMany(); await MeetingMinute.deleteMany(); await RenderHour.deleteMany(); await Allowance.deleteMany(); await Offense.deleteMany(); await PresidentReport.deleteMany(); await Attendance.deleteMany();
    console.log('ALL DATA DESTROYED!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};
 
if (process.argv[2] === '-d') destroyData(); else importData();