// // src/contexts/CourseContext.tsx
// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { Course } from '../types/course';

// interface CourseContextType {
//   courses: Course[];
//   addCourse: (course: Course) => void;
//   updateCourse: (updatedCourse: Course) => void;
//   getCourseById: (id: string) => Course | undefined;
// }

// const CourseContext = createContext<CourseContextType | undefined>(undefined);

// export const useCourse = () => {
//   const context = useContext(CourseContext);
//   if (!context) {
//     throw new Error('useCourse must be used within a CourseProvider');
//   }
//   return context;
// };

// interface CourseProviderProps {
//   children: ReactNode;
// }

// export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
//   const [courses, setCourses] = useState<Course[]>([]);

//   // Load from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem('courses');
//     if (stored) {
//       setCourses(JSON.parse(stored));
//     }
//   }, []);

//   // Save to localStorage
//   useEffect(() => {
//     localStorage.setItem('courses', JSON.stringify(courses));
//   }, [courses]);

//   const addCourse = (course: Course) => {
//     setCourses(prev => {
//       const exists = prev.find(c => c.id === course.id);
//       if (exists) return prev.map(c => c.id === course.id ? course : c);
//       return [...prev, course];
//     });
//   };

//   const updateCourse = (updatedCourse: Course) => {
//     setCourses(prev =>
//       prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c))
//     );
//   };

//   const getCourseById = (id: string) => {
//     return courses.find(c => c.id === id);
//   };

//   return (
//     <CourseContext.Provider value={{ courses, addCourse, updateCourse, getCourseById }}>
//       {children}
//     </CourseContext.Provider>
//   );
// };
