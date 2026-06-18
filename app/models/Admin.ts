import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Fitnest Admin' },
  role: { type: String, enum: ['admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
