import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Save, Plus, Trash2, Edit3, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore'; // Assuming Zustand store is correctly implemented

export const CourseEditor: React.FC = () => {
  const { courseId } = useParams();
  const { updateCourse, courses } = useCourseStore();

  const course = courses.find((c) => c.id === courseId);
  const [editedCourse, setEditedCourse] = useState(course);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Effect to set initial editedCourse when 'course' changes
  useEffect(() => {
    if (course) {
      // Deep clone the course object to avoid direct mutation of Zustand state
      const safeCourse = structuredClone(course);
      // Ensure nested arrays exist to prevent errors when adding new items
      safeCourse.modules = safeCourse.modules || [];
      safeCourse.modules.forEach((mod) => {
        mod.lessons = mod.lessons || [];
        mod.lessons.forEach((les) => {
          les.quiz = les.quiz || [];
        });
      });
      // Also ensure projects array exists
      safeCourse.projects = safeCourse.projects || [];
      setEditedCourse(safeCourse);
    }
  }, [course]);

  // Handle case where course is not found or not yet loaded
  if (!course || !editedCourse) {
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

  const handleSave = async () => {
    try {
      // 1. Save to Zustand (local state management)
      updateCourse({ ...editedCourse });

      // 2. Save to MongoDB (backend persistence)
      const res = await fetch(`https://tubecourse.onrender.comapi/courses/${editedCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCourse),
      });

      if (!res.ok) {
        // If backend returns an error, throw it to be caught
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update course in DB");
      }

      setSaveMessage("Changes saved successfully!");
      setIsEditing(false); // Exit editing mode after successful save

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err: any) { // Use 'any' for error type if not strictly typed
      console.error("Error saving course:", err);
      setSaveMessage(`Failed to save changes: ${err.message || 'Unknown error'}`);
      // Clear message after 3 seconds even on error
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Helper function to update nested state for modules/lessons/quizzes
  const updateNestedState = (path: string[], value: any) => {
    setEditedCourse(prevCourse => {
      if (!prevCourse) return prevCourse;

      const newCourse = structuredClone(prevCourse); // Deep clone for immutability
      let current: any = newCourse;

      // Traverse the path to the parent of the target property
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (Array.isArray(current) && !isNaN(Number(key))) {
          current = current[Number(key)];
        } else {
          current = current[key];
        }
      }

      // Update the target property
      const lastKey = path[path.length - 1];
      if (Array.isArray(current) && !isNaN(Number(lastKey))) {
        current[Number(lastKey)] = value;
      } else {
        current[lastKey] = value;
      }
      return newCourse;
    });
  };

  // Helper for adding new items
  const addModule = () => {
    const newModule = { title: 'New Module', description: '', lessons: [] };
    setEditedCourse(prev => ({ ...prev!, modules: [...(prev?.modules || []), newModule] }));
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson = { title: 'New Lesson', description: '', videoURL: '', quiz: [] };
    setEditedCourse(prev => {
      const updatedModules = structuredClone(prev!.modules);
      updatedModules[moduleIndex].lessons.push(newLesson);
      return { ...prev!, modules: updatedModules };
    });
  };

  const addQuiz = (moduleIndex: number, lessonIndex: number) => {
    const newQuiz = { question: '', options: ['', '', '', ''], correctAnswer: 0, difficulty: 'medium' as 'medium' | 'hard' };
    setEditedCourse(prev => {
      const updatedModules = structuredClone(prev!.modules);
      const lesson = updatedModules[moduleIndex].lessons[lessonIndex];
      lesson.quiz = lesson.quiz || []; // Ensure quiz array exists
      lesson.quiz.push(newQuiz);
      return { ...prev!, modules: updatedModules };
    });
  };

  const addProject = () => {
    const newProject = {
      title: 'New Project',
      description: '',
      difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
      keySkillsCovered: [],
      estimatedTime: '',
      milestones: [],
      suggestedTools: [],
      bonusFeatures: []
    };
    setEditedCourse(prev => ({ ...prev!, projects: [...(prev?.projects || []), newProject] }));
  };

  // Helper for removing items
  const removeModule = (moduleIndex: number) => {
    setEditedCourse(prev => {
      const updatedModules = prev!.modules.filter((_, i) => i !== moduleIndex);
      return { ...prev!, modules: updatedModules };
    });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setEditedCourse(prev => {
      const updatedModules = structuredClone(prev!.modules);
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      return { ...prev!, modules: updatedModules };
    });
  };

  const removeQuiz = (moduleIndex: number, lessonIndex: number, quizIndex: number) => {
    setEditedCourse(prev => {
      const updatedModules = structuredClone(prev!.modules);
      updatedModules[moduleIndex].lessons[lessonIndex].quiz = updatedModules[moduleIndex].lessons[lessonIndex].quiz!.filter((_, i) => i !== quizIndex);
      return { ...prev!, modules: updatedModules };
    });
  };

  const removeProject = (projectIndex: number) => {
    setEditedCourse(prev => {
      const updatedProjects = prev!.projects.filter((_, i) => i !== projectIndex);
      return { ...prev!, projects: updatedProjects };
    });
  };

  // Helper for reordering items (simplified for brevity, actual implementation needs more logic)
  const moveItem = (arr: any[], fromIndex: number, toIndex: number) => {
    const newArr = [...arr];
    const [movedItem] = newArr.splice(fromIndex, 1);
    newArr.splice(toIndex, 0, movedItem);
    return newArr;
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    setEditedCourse(prev => ({
      ...prev!,
      modules: moveItem(prev!.modules, fromIndex, toIndex)
    }));
  };

  const moveLesson = (moduleIndex: number, fromIndex: number, toIndex: number) => {
    setEditedCourse(prev => {
      const updatedModules = structuredClone(prev!.modules);
      updatedModules[moduleIndex].lessons = moveItem(updatedModules[moduleIndex].lessons, fromIndex, toIndex);
      return { ...prev!, modules: updatedModules };
    });
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
          <div className="flex space-x-3 items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              // Updated button colors
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Preview' : 'Edit'}</span>
            </button>
            <button
              onClick={handleSave}
              // Updated button colors
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            {saveMessage && (
              <div className="flex items-center space-x-3">
                <span className={`text-sm self-center ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveMessage}
                </span>

                <Link
                  to={`/preview/${editedCourse.id}`}
                  state={editedCourse}
                  // Updated button colors
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Course</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          {isEditing ? (
            <div className="space-y-6">
              {/* Course Meta Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={editedCourse.title}
                  onChange={(e) => updateNestedState(['title'], e.target.value)}
                  // Updated focus ring color
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={editedCourse.targetAudience}
                    onChange={(e) => updateNestedState(['targetAudience'], e.target.value)}
                    // Updated focus ring color
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={editedCourse.estimatedDuration}
                    onChange={(e) => updateNestedState(['estimatedDuration'], e.target.value)}
                    // Updated focus ring color
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Course Modules Editing */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Course Modules</h3>
                  <button
                    onClick={addModule}
                    // Updated button colors
                    className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Module</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editedCourse.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50"> {/* Updated border and background */}
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateNestedState(['modules', moduleIndex, 'title'], e.target.value)}
                          // Updated focus ring color
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mr-4"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveModule(moduleIndex, moduleIndex - 1)}
                            disabled={moduleIndex === 0}
                            className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveModule(moduleIndex, moduleIndex + 1)}
                            disabled={moduleIndex === editedCourse.modules.length - 1}
                            className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeModule(moduleIndex)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Module Description */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Module Description
                        </label>
                        <textarea
                          value={module.description}
                          onChange={(e) => updateNestedState(['modules', moduleIndex, 'description'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      <div className="ml-4 space-y-2">
                        {/* Lessons within Module */}
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-md font-semibold text-gray-700">Lessons</h4>
                          <button
                            onClick={() => addLesson(moduleIndex)}
                            // Updated button colors
                            className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Lesson</span>
                          </button>
                        </div>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="space-y-2 bg-white p-4 rounded border border-gray-200"> {/* Updated background and border */}
                            {/* Lesson Title */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateNestedState(['modules', moduleIndex, 'lessons', lessonIndex, 'title'], e.target.value)}
                              // Updated focus ring color
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent mb-2"
                            />
                            {/* Lesson Description */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Description</label>
                            <textarea
                              value={lesson.description}
                              onChange={(e) => updateNestedState(['modules', moduleIndex, 'lessons', lessonIndex, 'description'], e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent mb-2"
                              rows={2}
                            />
                            {/* Video URL */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                            <input
                              type="url"
                              value={lesson.videoURL || ''}
                              onChange={(e) => updateNestedState(['modules', moduleIndex, 'lessons', lessonIndex, 'videoURL'], e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent mb-2"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                            {/* Lesson Actions */}
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => moveLesson(moduleIndex, lessonIndex, lessonIndex - 1)}
                                disabled={lessonIndex === 0}
                                className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveLesson(moduleIndex, lessonIndex, lessonIndex + 1)}
                                disabled={lessonIndex === module.lessons.length - 1}
                                className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Quizzes within Lesson */}
                            <div className="mt-4 border-t border-gray-100 pt-4"> {/* Light border for separation */}
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-md font-semibold text-gray-700">Quizzes</h5>
                                <button
                                  onClick={() => addQuiz(moduleIndex, lessonIndex)}
                                  // Updated button colors
                                  className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Quiz</span>
                                </button>
                              </div>
                              {lesson.quiz?.map((quiz, quizIndex) => (
                                <div key={quizIndex} className="bg-gray-100 border border-gray-200 rounded p-3 space-y-2 mb-2"> {/* Updated background and border */}
                                  {/* Question */}
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                  <input
                                    type="text"
                                    value={quiz.question}
                                    onChange={(e) => updateNestedState(['modules', moduleIndex, 'lessons', lessonIndex, 'quiz', quizIndex, 'question'], e.target.value)}
                                    // Updated focus ring color
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Quiz question"
                                  />
                                  {/* Difficulty */}
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                  <select
                                    value={quiz.difficulty}
                                    onChange={(e) => updateNestedState(['modules', moduleIndex, 'lessons', lessonIndex, 'quiz', quizIndex, 'difficulty'], e.target.value as 'medium' | 'hard')}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent"
                                  >
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                  </select>

                                  {/* Options */}
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                                  {quiz.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const updated = structuredClone(editedCourse.modules);
                                          updated[moduleIndex].lessons[lessonIndex].quiz![quizIndex].options[optIndex] = e.target.value;
                                          setEditedCourse({ ...editedCourse, modules: updated });
                                        }}
                                        // Updated focus ring color
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent"
                                        placeholder={`Option ${optIndex + 1}`}
                                      />
                                      <input
                                        type="radio"
                                        name={`correct-${moduleIndex}-${lessonIndex}-${quizIndex}`}
                                        checked={Number(quiz.correctAnswer) === optIndex}
                                        onChange={() => {
                                          const updated = structuredClone(editedCourse.modules);
                                          updated[moduleIndex].lessons[lessonIndex].quiz![quizIndex].correctAnswer = optIndex;
                                          setEditedCourse({ ...editedCourse, modules: updated });
                                        }}
                                        // Updated radio button accent color (might need custom CSS for full control)
                                        className="form-radio text-red-600 focus:ring-red-500"
                                        title="Mark as correct answer"
                                      />
                                      <button
                                        onClick={() => {
                                          const updated = structuredClone(editedCourse.modules);
                                          updated[moduleIndex].lessons[lessonIndex].quiz![quizIndex].options = updated[moduleIndex].lessons[lessonIndex].quiz![quizIndex].options.filter((_, i) => i !== optIndex);
                                          setEditedCourse({ ...editedCourse, modules: updated });
                                        }}
                                        className="text-gray-500 hover:text-red-600"
                                        title="Remove option"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}

                                  {/* Add Option Button */}
                                  <button
                                    onClick={() => {
                                      const updated = structuredClone(editedCourse.modules);
                                      updated[moduleIndex].lessons[lessonIndex].quiz![quizIndex].options.push('');
                                      setEditedCourse({ ...editedCourse, modules: updated });
                                    }}
                                    className="text-sm text-red-600 hover:underline flex items-center space-x-1 mt-2"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Option</span>
                                  </button>
                                  <div className="flex justify-end mt-2">
                                    <button
                                      onClick={() => removeQuiz(moduleIndex, lessonIndex, quizIndex)}
                                      className="text-gray-500 hover:text-red-600 text-sm"
                                      title="Remove quiz"
                                    >
                                      <Trash2 className="w-4 h-4 inline-block mr-1" /> Remove Quiz
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Editing */}
              <div>
                <div className="flex justify-between items-center mb-4 mt-8">
                  <h3 className="text-lg font-semibold text-gray-800">Hands-on Projects</h3>
                  <button
                    onClick={addProject}
                    // Updated button colors
                    className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {editedCourse.projects?.map((project, projectIndex) => (
                    <div key={projectIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateNestedState(['projects', projectIndex, 'title'], e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mr-4"
                          placeholder="Project Title"
                        />
                        <button
                          onClick={() => removeProject(projectIndex)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'description'], e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        rows={3}
                        placeholder="Project Description"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        value={project.difficulty}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'difficulty'], e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>

                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                      <input
                        type="text"
                        value={project.estimatedTime}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'estimatedTime'], e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        placeholder="e.g., 4-6 hours"
                      />

                      {/* Key Skills Covered */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={project.keySkillsCovered.join(', ')}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'keySkillsCovered'], e.target.value.split(',').map(s => s.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        placeholder="e.g., HTML, CSS, JavaScript"
                      />

                      {/* Milestones */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">Milestones (one per line)</label>
                      <textarea
                        value={project.milestones.join('\n')}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'milestones'], e.target.value.split('\n').map(s => s.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        rows={3}
                        placeholder="Step 1: Set up project structure&#10;Step 2: Build UI components"
                      />

                      {/* Suggested Tools */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Tools (comma-separated)</label>
                      <input
                        type="text"
                        value={project.suggestedTools.join(', ')}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'suggestedTools'], e.target.value.split(',').map(s => s.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        placeholder="e.g., VS Code, Git, Chrome DevTools"
                      />

                      {/* Bonus Features */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Features (one per line, optional)</label>
                      <textarea
                        value={project.bonusFeatures?.join('\n') || ''}
                        onChange={(e) => updateNestedState(['projects', projectIndex, 'bonusFeatures'], e.target.value.split('\n').map(s => s.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
                        rows={2}
                        placeholder="Add dark mode&#10;Implement user authentication"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Preview Mode
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{editedCourse.title}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm">
                  <span>Target Audience: <span className="font-medium">{editedCourse.targetAudience}</span></span>
                  <span>Estimated Duration: <span className="font-medium">{editedCourse.estimatedDuration}</span></span>
                  <span>Modules: <span className="font-medium">{editedCourse.modules.length}</span></span>
                  <span>Projects: <span className="font-medium">{editedCourse.projects?.length || 0}</span></span>
                </div>
              </div>

              {/* Modules Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Modules Preview</h3>
                {editedCourse.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-800 mb-2">{module.title}</h4>
                    <p className="text-gray-700 text-sm mb-3">{module.description}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex}>
                          <span className="font-medium">{lesson.title}</span> - {lesson.description}
                          {lesson.videoURL && (
                            <a href={lesson.videoURL} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline ml-2 text-xs">
                              (Watch Video)
                            </a>
                          )}
                          {lesson.quiz && lesson.quiz.length > 0 && (
                            <span className="text-gray-500 ml-2 text-xs">({lesson.quiz.length} Quizzes)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects Preview */}
              {editedCourse.projects && editedCourse.projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Projects Preview</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {editedCourse.projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-800 mb-2">{project.title}</h4>
                        <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                        <p className="text-gray-600 text-xs">Difficulty: {project.difficulty}</p>
                        <p className="text-gray-600 text-xs">Time: {project.estimatedTime}</p>
                        {project.keySkillsCovered.length > 0 && (
                          <p className="text-gray-600 text-xs">Skills: {project.keySkillsCovered.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
