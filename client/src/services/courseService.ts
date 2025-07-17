import { Course } from '../types/course';

export const generateCourseFromPlaylist = async (playlistUrl: string): Promise<Course> => {
  const response = await fetch('https://tubecourse.onrender.com/api/process-playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playlistUrl }), 
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const resJson = await response.json();
  console.log('API response:', resJson);

 
  const course: Course = {
    id: resJson.id,
    title: resJson.title,
    source: resJson.source,
    raw: resJson.raw,
    ...resJson.course, 
  };

  console.log('Generated course:', course);
  return course;
};

export const saveCourseToDB = async (course: any) => {
  const res = await fetch('https://tubecourse.onrender.com/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });

  if (!res.ok) {
    throw new Error('Failed to save course to DB');
  }

  return await res.json(); // should contain _id
};
