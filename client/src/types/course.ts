export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  title: string;
  description: string;
  quiz?: QuizQuestion[];
  videoURL: string | null;
  duration?: string; // Added duration as optional string
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Project {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced"; // Specific enum for clarity
  keySkillsCovered: string[];
  estimatedTime: string;
  milestones: string[];
  suggestedTools: string[];
  bonusFeatures?: string[]; // Optional, as it might not always be generated
}

export interface Course {
  id: string;
  title: string;
  source: string;
  targetAudience?: string;
  estimatedDuration?: string;
  modules: Module[];
  projects?: Project[];
  raw?: string[]; 
}
