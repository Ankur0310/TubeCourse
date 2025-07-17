import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Edit, Download, Share, Clock, Users, BookOpen, Brain, Code } from 'lucide-react';
import { CourseModule } from '../components/CourseModule';
import { ProjectCard } from '../components/ProjectCard';
import { Course } from '../types/course';
import axios from "axios";

export const CoursePreview: React.FC = () => {
  const location = useLocation();
  const fromState = location.state as Course | undefined;
  const { courseId } = useParams<{ courseId: string }>();

  console.log("Fetching course with ID:", courseId);

  const [course, setCourse] = useState<Course | null>(fromState ?? null);
  const [loading, setLoading] = useState(!fromState);
  const [activeTab, setActiveTab] = useState<'modules' | 'projects'>('modules');
  const [shareMessage, setShareMessage] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    if (!courseId) return;

    if (!course) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(`https://tubecourse.onrender.comapi/courses/${courseId}`);
          setCourse(res.data);
        } catch (err) {
          console.error("Fetch failed", err);
          setCourse(null);
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [courseId, course]);

  // Function to generate Markdown content from the course object
  const generateMarkdown = (courseData: Course): string => {
    let markdown = `# ${courseData.title}\n\n`;
    markdown += `**Target Audience:** ${courseData.targetAudience || 'N/A'}\n`;
    markdown += `**Estimated Duration:** ${courseData.estimatedDuration || 'N/A'}\n\n`;

    if (courseData.modules && courseData.modules.length > 0) {
      markdown += `## Course Modules\n\n`;
      courseData.modules.forEach((module, modIndex) => {
        markdown += `### Module ${modIndex + 1}: ${module.title}\n\n`;
        if (module.description) {
          markdown += `${module.description}\n\n`;
        }
        if (module.lessons && module.lessons.length > 0) {
          module.lessons.forEach((lesson, lesIndex) => {
            markdown += `#### Lesson ${lesIndex + 1}: ${lesson.title}\n\n`;
            if (lesson.description) {
              markdown += `${lesson.description}\n\n`;
            }
            if (lesson.videoURL) {
              markdown += `[Watch Video](${lesson.videoURL})\n\n`;
            }
            if (lesson.quiz && lesson.quiz.length > 0) {
              markdown += `##### Quizzes\n\n`;
              lesson.quiz.forEach((quiz, quizIndex) => {
                markdown += `**Q${quizIndex + 1} (${quiz.difficulty}):** ${quiz.question}\n`;
                quiz.options.forEach((option, optIndex) => {
                  markdown += `- [${optIndex === quiz.correctAnswer ? 'x' : ' '}] ${option}\n`;
                });
                markdown += `*Correct Answer: ${quiz.options[quiz.correctAnswer]}*\n\n`;
              });
            }
          });
        }
      });
    }

    if (courseData.projects && courseData.projects.length > 0) {
      markdown += `## Hands-on Projects\n\n`;
      courseData.projects.forEach((project, projIndex) => {
        markdown += `### Project ${projIndex + 1}: ${project.title}\n\n`;
        markdown += `${project.description}\n\n`;
        markdown += `**Difficulty:** ${project.difficulty}\n`;
        markdown += `**Estimated Time:** ${project.estimatedTime}\n`;
        if (project.keySkillsCovered && project.keySkillsCovered.length > 0) {
          markdown += `**Key Skills:** ${project.keySkillsCovered.join(', ')}\n`;
        }
        if (project.suggestedTools && project.suggestedTools.length > 0) {
          markdown += `**Suggested Tools:** ${project.suggestedTools.join(', ')}\n`;
        }
        if (project.milestones && project.milestones.length > 0) {
          markdown += `**Milestones:**\n`;
          project.milestones.forEach(milestone => {
            markdown += `- ${milestone}\n`;
          });
        }
        if (project.bonusFeatures && project.bonusFeatures.length > 0) {
          markdown += `**Bonus Features:**\n`;
          project.bonusFeatures.forEach(feature => {
            markdown += `- ${feature}\n`;
          });
        }
        markdown += '\n';
      });
    }

    return markdown;
  };


  const handleExport = (format: 'json' | 'markdown') => {
    if (!course) return;

    let filename = `tubecourse-${course.title.replace(/\s/g, '_').toLowerCase()}`;
    let content = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify(course, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else if (format === 'markdown') {
      content = generateMarkdown(course);
      mimeType = 'text/markdown';
      filename += '.md';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportMessage(`Exported as ${format.toUpperCase()}!`);
    setTimeout(() => setExportMessage(''), 3000);
  };

  const handleShare = () => {
    const courseLink = window.location.href; // Get the current URL
    try {
      // Use document.execCommand for clipboard copy in iframe environments
      const textarea = document.createElement('textarea');
      textarea.value = courseLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setShareMessage('Failed to copy link.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  if (loading) return <div className="pt-20 text-center">Loading...</div>;

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Course not found</h2>
          <Link to="/generator" className="text-red-600 hover:underline">
            Generate a new course
          </Link>
        </div>
      </div>
    );
  }

  const totalModules = course.modules?.length || 0;
  const totalQuizzes = course.modules?.reduce(
    (total, module) =>
      total +
      (module.lessons?.reduce(
        (lessonTotal, lesson) => lessonTotal + (lesson.quiz?.length || 0),
        0
      ) || 0),
    0
  );
  const totalLessons = course.modules?.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );
  const totalProjects = course.projects?.length || 0;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">
                <span className="text-red-600">Tube</span>
                <span className="text-gray-800">Course</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                {course.targetAudience && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{course.targetAudience}</span>
                  </div>
                )}
                {course.estimatedDuration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.estimatedDuration}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{totalModules} Modules</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 items-center"> {/* Added items-center for alignment */}
              <Link
                to={`/editor/${course.id}`}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                  <button
                    onClick={() => handleExport('json')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Markdown
                  </button>
                </div>
              </div>
              {exportMessage && <span className="text-sm text-green-600">{exportMessage}</span>}

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              {shareMessage && <span className="text-sm text-green-600">{shareMessage}</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <Brain className="w-8 h-8 text-red-600 mb-2" />
              <h3 className="font-semibold mb-1">Interactive Quizzes</h3>
              <p className="text-sm text-gray-600">{totalQuizzes} questions generated</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Code className="w-8 h-8 text-gray-700 mb-2" />
              <h3 className="font-semibold mb-1">Hands-on Projects</h3>
              <p className="text-sm text-gray-600">{totalProjects} coding projects included</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <BookOpen className="w-8 h-8 text-gray-600 mb-2" />
              <h3 className="font-semibold mb-1">Structured Learning</h3>
              <p className="text-sm text-gray-600">{totalLessons} lessons organized</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300 mb-8">
          <button
            className={`py-3 px-6 text-lg font-medium transition-colors duration-200
              ${activeTab === 'modules'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600 hover:text-gray-800'
              }`}
            onClick={() => setActiveTab('modules')}
          >
            Course Modules
          </button>
          {course.projects && course.projects.length > 0 && (
            <button
              className={`py-3 px-6 text-lg font-medium transition-colors duration-200
                ${activeTab === 'projects'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setActiveTab('projects')}
            >
              Hands-on Projects
            </button>
          )}
        </div>

        {/* Conditional Content Rendering */}
        {activeTab === 'modules' && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Course Modules</h2>
            {course.modules?.map((module, index) => (
              <CourseModule key={index} module={module} moduleIndex={index} />
            ))}
          </div>
        )}

        {activeTab === 'projects' && course.projects && course.projects.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Hands-on Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {course.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
