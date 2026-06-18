import mongoose from 'mongoose'

const SiteSettingsSchema = new mongoose.Schema({
  heroSlogan: { type: String, default: 'BUILD YOUR STRENGTH' },
  heroSubtext: { type: String, default: "Pakistan's most driven fitness community." },
  gymPhone: { type: String, default: '+92 300 1234567' },
  gymEmail: { type: String, default: 'info@fitnestlahore.com' },
  gymAddress: { type: String, default: 'Model Town, Lahore' },
  gymHours: { type: String, default: '6AM – 11PM' },
  announcementBar: { type: String, default: '' },
  announcementActive: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema)