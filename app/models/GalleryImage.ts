import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GallerySchema)