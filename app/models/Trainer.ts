import mongoose from 'mongoose'

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: String, required: true },
  certifications: { type: String, required: true },
  initials: { type: String, required: true },
  color: { type: String, default: '#FF6B00' },
  instagram: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Trainer || mongoose.model('Trainer', TrainerSchema)