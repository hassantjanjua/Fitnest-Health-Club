import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  plan: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  totalPaid: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)