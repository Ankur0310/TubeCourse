import { create } from 'zustand';
import { Course } from '../types/course';

interface CourseStore {
  courses: Course[];
  addCourse: (course: Course) => void;
  getCourseById: (id: string) => Course | undefined;
  updateCourse: (course: Course) => void;
  loadCourse: (course: Course) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],

  addCourse: (course) => {
    set((state) => ({
      courses: [...state.courses, course],
    }));
  },

  getCourseById: (id) => {
    return get().courses.find((c) => c.id === id);
  },

  updateCourse: (updated: Course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === updated.id ? updated : c)),
    })),

  loadCourse: (course) => {
    const existing = get().courses.find((c) => c.id === course.id);
    if (!existing) {
      set((state) => ({ courses: [...state.courses, course] }));
    }
  },
}));
