const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'Faculty', 'EOSA', 'Student Assistant'] },
    subRole: { type: String, enum: ['President', 'Secretary', 'Treasurer', 'Timekeeper', 'None'], default: 'None' },
     
    renderHours: { type: Number, default: 0 },
    leaveBalance: { type: Number, default: 15 },  
    isEligibleForAllowance: { type: Boolean, default: false },
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    allowanceHistory: [{
        cutoffDate: Date,
        amount: Number,
        status: String, 
    }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;