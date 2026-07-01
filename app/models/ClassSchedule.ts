import mongoose from 'mongoose'

const ClassScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  className: { type: String, required: true },
  trainer: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.ClassSchedule || mongoose.model('ClassSchedule', ClassScheduleSchema)