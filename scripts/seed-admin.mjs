import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI
const email = (process.env.ADMIN_EMAIL || 'admin@fitnestlahore.com').trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD || 'admin123'

if (!mongoUri) {
  throw new Error('MONGODB_URI is required. Set it in .env.local before seeding the admin.')
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Fitnest Admin' },
  role: { type: String, enum: ['owner', 'admin', 'manager'], default: 'owner' },
  assignmentScope: { type: String, enum: ['full-control', 'assigned-control', 'handover-control'], default: 'full-control' },
  assignedTo: { type: String, default: '' },
  sessionDuration: { type: String, enum: ['1d', '1w', '1m'], default: '1d' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true })

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

await mongoose.connect(mongoUri, { bufferCommands: false })

const passwordHash = await bcrypt.hash(password, 12)
await Admin.findOneAndUpdate(
  { email },
  {
    $set: {
      email,
      passwordHash,
      name: 'Fitnest Admin',
      role: 'owner',
      assignmentScope: 'full-control',
      sessionDuration: '1d',
      isActive: true,
    },
  },
  { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
)

await mongoose.disconnect()

console.log(`Seeded admin: ${email}`)
