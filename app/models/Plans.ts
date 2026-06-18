import mongoose from 'mongoose'

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  period: { type: String, required: true },
  tag: { type: String, required: true },
  featured: { type: Boolean, default: false },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema)