import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://tubecourse.onrender.com/';

export const loadCourse = async (courseId) => {
  const res = await axios.get(`${API_BASE}/courses/${courseId}`);
  return res.data;
};

export const saveCourse = async (courseData) => {
  const res = await axios.post(`${API_BASE}/courses`, courseData);
  return res.data;
};