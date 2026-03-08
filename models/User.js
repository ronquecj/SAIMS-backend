const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'Faculty', 'EOSA', 'Student Assistant'] },
    subRole: { type: String, enum: ['President', 'Secretary', 'Treasurer', 'Timekeeper', 'None'], default: 'None' },
    profilePicture: { type: String, default: '' },
    office: { type: String, default: 'Unassigned' },
    schoolYear: { type: String, default: '2025-2026' },
    semester: { type: String, default: '2nd Semester' },
    renderHours: { type: Number, default: 0 },
    leaveBalance: { type: Number, default: 25 }, 
    isEligibleForAllowance: { type: Boolean, default: false },
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notifications:[{ message: String, date: { type: Date, default: Date.now }, isRead: { type: Boolean, default: false } }],
     
    department: { type: String, default: '' },
    position: { type: String, default: '' },
    
    biodata: {
        mobile: { type: String, default: '' }, gender: { type: String, default: '' }, fathersName: { type: String, default: '' },
        dob: { type: String, default: '' }, education: { type: String, default: '' }, experience: { type: String, default: '' },
        maritalStatus: { type: String, default: '' }, religion: { type: String, default: '' }, languages: { type: String, default: '' },
        hobbies: { type: String, default: '' }, bloodGroup: { type: String, default: '' }, siblings: { type: String, default: '' },
        address: { type: String, default: '' }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);