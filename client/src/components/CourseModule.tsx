import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, Brain, Clock } from 'lucide-react';
import { Module } from '../types/course';
import { LessonCard } from './LessonCard';

interface CourseModuleProps {
  module: Module;
  moduleIndex: number;
}

export const CourseModule: React.FC<CourseModuleProps> = ({ module, moduleIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalDuration = module.lessons.reduce((total, lesson) => {
    if (lesson.duration) {
      const [minutes, seconds] = lesson.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }
    return total;
  }, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-gray-100 transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white font-semibold">
              {moduleIndex + 1}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3> 
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{module.lessons.length} lessons</span>
                {totalDuration > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <Brain className="w-4 h-4" />
              <span>{(module?.lessons ?? []).reduce((total, lesson) => total + (lesson.quiz?.length || 0 ), 0)} quizzes</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50/50">
          <div className="p-6 space-y-4">
            {module.lessons.map((lesson, lessonIndex) => (
              <LessonCard key={lessonIndex} lesson={lesson} lessonIndex={lessonIndex} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
