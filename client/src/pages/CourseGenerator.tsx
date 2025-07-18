import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Loader2, BookOpen, Users, Clock, Brain } from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore'; // Assuming Zustand store is correctly implemented
import { generateCourseFromPlaylist, saveCourseToDB } from '../services/courseService'; // Assuming service functions are correctly implemented

export const CourseGenerator: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Generating, 3: Success

  const addCourse = useCourseStore(state => state.addCourse); // Zustand action

  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!playlistUrl.trim()) return;

    setIsGenerating(true);
    setStep(2); // Move to generating step

    try {
      // Call the service to generate course from playlist
      const generatedCourse = await generateCourseFromPlaylist(playlistUrl);
      //console.log("Generated course data:", generatedCourse);

      // Save to MongoDB via your backend service
      const savedCourseResponse = await saveCourseToDB(generatedCourse.course); // Assuming generatedCourse.course holds the actual course data
      //console.log("Course saved to DB:", savedCourseResponse);

      // Update the generated course object with the ID from DB and source URL
      generatedCourse.id = savedCourseResponse._id; // Assuming the saved response contains _id
      generatedCourse.source = playlistUrl;

      // Save in Zustand store for immediate access
      addCourse(generatedCourse);

      setStep(3); // Move to success step

      // Redirect after short delay to allow user to see success message
      setTimeout(() => {
        navigate(`/preview/${savedCourseResponse._id}`, { state: generatedCourse });
      }, 3000); // Reduced delay for smoother UX
    } catch (error) {
      console.error('Failed to generate course:', error);
      setIsGenerating(false);
      setStep(1); // Revert to input step on error
      // Optionally, add an error message display to the UI
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            Create Your <span className="text-red-600">Tube</span><span className="text-gray-800">Course</span>
          </h1>
          <p className="text-xl text-gray-600">
            Paste a YouTube playlist URL and watch AI transform it into a structured course
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Playlist URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="url"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://youtube.com/playlist?list=..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-red-600 mb-2" />
                  <h3 className="font-semibold mb-1">Smart Modules</h3>
                  <p className="text-sm text-gray-600">Auto-organized learning modules</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <Brain className="w-8 h-8 text-gray-700 mb-2" />
                  <h3 className="font-semibold mb-1">AI Quizzes</h3>
                  <p className="text-sm text-gray-600">Generated assessments</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <Users className="w-8 h-8 text-gray-600 mb-2" />
                  <h3 className="font-semibold mb-1">Projects</h3>
                  <p className="text-sm text-gray-600">Hands-on coding projects</p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!playlistUrl.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Generate Course
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Analyzing Your Playlist</h3>
              <p className="text-gray-600 mb-6">
                Our AI is processing the videos and creating your course structure...
              </p>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-sm">
                  <span>Extracting video information</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Creating course modules</span>
  
                  <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Generating quizzes</span>
                  <span>○</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Creating projects</span>
                  <span>○</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
             
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Course Generated Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Your course is ready. Redirecting to preview...
              </p>
              <div className="animate-pulse">
                <div className="h-2 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
