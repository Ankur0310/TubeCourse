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
  duration?: string; 
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Project {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced"; 
  keySkillsCovered: string[];
  estimatedTime: string;
  milestones: string[];
  suggestedTools: string[];
  bonusFeatures?: string[]; 
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
