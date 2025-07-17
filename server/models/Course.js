// models/Course.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number, // Index of the correct answer (0-3)
});

const lessonSchema = new mongoose.Schema({
  title: String,
  description: String, // Added description for lesson
  quiz: [quizSchema],
  videoURL: { type: String, default: null },
});

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String, // Added description for module
  lessons: [lessonSchema],
});

// New Project Schema to match the updated interface
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  keySkillsCovered: [String],
  estimatedTime: String,
  milestones: [String],
  suggestedTools: [String],
  bonusFeatures: [String], // Optional field
});

const courseSchema = new mongoose.Schema({
  title: String,
  targetAudience: String,
  estimatedDuration: String,
  modules: [moduleSchema],
  projects: [projectSchema], // Added the projects array
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);