import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Event' },
  day: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model('Event', EventSchema)