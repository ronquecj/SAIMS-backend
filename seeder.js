const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); 
const bcrypt = require('bcryptjs');
 
// Load Models
const connectDB = require('./config/db');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const LeaveRequest = require('./models/LeaveRequest');  
const MeetingMinute = require('./models/MeetingMinute');  

dotenv.config();
connectDB();

const importData = async () => {
  try {  
    await User.deleteMany();
    await Announcement.deleteMany();
    await LeaveRequest.deleteMany();
    await MeetingMinute.deleteMany();
 
    const usersData = [
      // --- ADMINS ---
      { fullName: 'Global Admin', email: 'admin@saims.com', password: 'password123', role: 'Admin', subRole: 'None' },
      
      // --- FACULTY / STAFF ---
      { fullName: 'Dr. Jane Smith', email: 'jane.smith@saims.com', password: 'password123', role: 'Faculty', subRole: 'None' },
      { fullName: 'Prof. John Doe', email: 'john.doe@saims.com', password: 'password123', role: 'Faculty', subRole: 'None' },
      
      // --- SA OFFICERS ---
      { 
        fullName: 'Juan Dela Cruz (President)', 
        email: 'juan.cruz@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'President', 
        renderHours: 45, 
        leaveBalance: 14,
        isEligibleForAllowance: true, 
        allowanceHistory: [
            { cutoffDate: new Date('2025-12-31'), amount: 1500, status: 'Received' },
            { cutoffDate: new Date('2025-11-30'), amount: 1500, status: 'Received' },
        ],
      },
      { 
        fullName: 'Maria Clara (Secretary)', 
        email: 'maria.clara@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'Secretary', 
        renderHours: 42, 
        leaveBalance: 15,
        isEligibleForAllowance: true,
      },
      { 
        fullName: 'Emilio Aguinaldo (Treasurer)', 
        email: 'emilio.aguinaldo@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'Treasurer', 
        renderHours: 50, 
        leaveBalance: 10,
        isEligibleForAllowance: true,
        allowanceHistory: [
            { cutoffDate: new Date('2026-01-31'), amount: 1500, status: 'Received' },
        ],
      },
      { 
        fullName: 'Andres Bonifacio (Timekeeper)', 
        email: 'andres.bonifacio@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'Timekeeper', 
        renderHours: 40, 
        leaveBalance: 15,
        isEligibleForAllowance: false,
      },
      
      // --- REGULAR SA (for testing lists and verification) ---
      { 
        fullName: 'Jose Rizal (Regular SA)', 
        email: 'jose.rizal@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'None', 
        renderHours: 35, 
        leaveBalance: 10,
        isEligibleForAllowance: false,
      },
      { 
        fullName: 'Gabriela Silang (Regular SA)', 
        email: 'gabriela.silang@saims.com', 
        password: 'password123', 
        role: 'Student Assistant', 
        subRole: 'None', 
        renderHours: 60,  
        leaveBalance: 15,
        isEligibleForAllowance: false,
      },
    ];
 
    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(
        usersData.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, salt),
        }))
    );
 
    // Insert Users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    
    // Find key users for relationships
    const adminUser = createdUsers.find(u => u.role === 'Admin');
    const saPresident = createdUsers.find(u => u.subRole === 'President');
    const saSecretary = createdUsers.find(u => u.subRole === 'Secretary');
    const saTimekeeper = createdUsers.find(u => u.subRole === 'Timekeeper');
    const saRizal = createdUsers.find(u => u.fullName.includes('Rizal'));
    const facultySmith = createdUsers.find(u => u.fullName.includes('Smith'));
    
    // --- Initial Assignments (Simulate Admin action) --- 
    await User.findByIdAndUpdate(saPresident._id, { assignedFaculty: facultySmith._id });
    await User.findByIdAndUpdate(saRizal._id, { assignedFaculty: facultySmith._id });


    // --- Create Announcements (Admin/President/Secretary can create) ---
    const sampleAnnouncements = [
        {
            title: 'Mandatory Seminar on Professionalism',
            content: 'All SA officers must attend the seminar on professional conduct on March 1, 2026. See the full email for details.',
            author: saPresident._id,
            authorName: saPresident.fullName,
        },
        {
            title: 'Deadline for Render Hours Submission (FEB Cutoff)',
            content: 'Please be reminded that the deadline for submitting your render hours for the February cutoff is on February 28, 2026. Submit to the Timekeeper.',
            author: adminUser._id,
            authorName: adminUser.fullName,
        },
        {
            title: 'General Assembly Reminder',
            content: 'There will be a mandatory General Assembly for all Student Assistants on February 10, 2026, at the University Auditorium. Attendance is a must.',
            author: saSecretary._id,
            authorName: saSecretary.fullName,
        }
    ];

    await Announcement.insertMany(sampleAnnouncements);

    // --- Create Leave Requests (For Timekeeper to manage) ---
    const leaveRequestsData = [
        {
            studentAssistant: saRizal._id,
            reason: 'Sickness, high fever. Need to rest for 2 days.',
            status: 'Pending',
        },
        {
            studentAssistant: saPresident._id,
            reason: 'Personal emergency. Needs to travel home.',
            status: 'Approved',
        },
        {
            studentAssistant: saTimekeeper._id,
            reason: 'Needed to attend a family wedding.',
            status: 'Denied',
            denialReason: 'Request was submitted less than 24 hours before the date.',
        },
    ];

    await LeaveRequest.insertMany(leaveRequestsData);

    // --- Create Meeting Minutes (For Secretary) ---
    const minutesData = [
        {
            title: 'Monthly Officer Meeting - January 2026',
            date: new Date('2026-01-15'),
            content: '1. Discussed budget for the upcoming semester.\n2. Planned the annual team-building event.\n3. Assigned tasks for the student orientation week.',
            createdBy: saSecretary._id,
        },
        {
            title: 'Emergency Planning Session - February 2026',
            date: new Date('2026-02-05'),
            content: '1. Finalized the contingency plan for event cancellations.\n2. Reviewed the new allowance distribution process.',
            createdBy: saSecretary._id,
        },
    ];
    
    await MeetingMinute.insertMany(minutesData);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Announcement.deleteMany();
    await LeaveRequest.deleteMany();
    await MeetingMinute.deleteMany();
    
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};
 
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}