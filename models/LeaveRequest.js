const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    studentAssistant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Denied'],
      default: 'Pending',
    },
    denialReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;