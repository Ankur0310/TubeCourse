import React, { useState } from 'react';
import { Play, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { Lesson } from '../types/course';
import { QuizQuestion } from './QuizQuestion';
import { VideoPlayer } from './VideoPlayer';

interface LessonCardProps {
  lesson: Lesson;
  lessonIndex: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, lessonIndex }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const handlePlayVideo = () => setShowVideoPlayer(true);
  const handleCloseVideo = () => setShowVideoPlayer(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={handlePlayVideo}
              className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors group"
            >
              <Play className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            </button>

            <div className="flex-1">
              <button
                onClick={handlePlayVideo}
                className="text-left w-full group"
              >
                <h4 className="font-semibold mb-2 group-hover:text-red-600 transition-colors">
                  {lesson.title}
                </h4>
              </button>

             
              {lesson.description && (
                <p className="text-sm text-gray-700 mb-3">{lesson.description}</p>
              )}

              
              {(lesson?.quiz?.length ?? 0) > 0 && (
                <button
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  <span>{lesson.quiz.length} Quiz Questions</span>
                  {showQuiz ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {showQuiz && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="space-y-4">
                {(lesson?.quiz ?? []).map((question, index) => (
                  <QuizQuestion key={index} question={question} questionIndex={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <VideoPlayer
          videoUrl={lesson.videoURL || `https://youtube.com/watch?v=dQw4w9WgXcQ`}
          title={lesson.title}
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
};
