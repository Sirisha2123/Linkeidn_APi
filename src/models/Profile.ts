import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  sub: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  given_name: {
    type: String,
    required: true,
  },
  family_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: String,
  locale: {
    country: String,
    language: String,
  },
  // Additional fields for extended profile data
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
  }],
  skills: [String],
  posts: [{
    id: String,
    text: String,
    createdAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema); 