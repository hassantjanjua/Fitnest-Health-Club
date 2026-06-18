import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '', trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'replied'], default: 'new' },
  reply: { type: String, default: '', trim: true },
  repliedAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)
