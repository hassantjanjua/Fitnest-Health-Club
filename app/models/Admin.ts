import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Fitnest Admin' },
  role: { type: String, default: 'admin', trim: true },
  assignmentScope: { type: String, enum: ['full-control', 'assigned-control', 'handover-control'], default: 'full-control' },
  assignedTo: { type: String, default: '' },
  allowedPages: { type: [String], default: undefined },
  sessionDuration: { type: String, enum: ['1d', '1w', '1m'], default: '1d' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
