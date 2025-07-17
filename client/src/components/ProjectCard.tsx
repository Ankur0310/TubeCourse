import React from 'react';
import { Code } from 'lucide-react';
import { Project } from '../types/course';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{project.title}</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${project.difficulty === 'Beginner' ? 'bg-red-100 text-red-800' :
              project.difficulty === 'Intermediate' ? 'bg-red-200 text-red-900' :
              'bg-red-300 text-red-900'}`}>
            {project.difficulty}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 flex-grow">{project.description}</p>

      {/* Estimated Time */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-1">Estimated Time:</h4>
        <p className="text-gray-600 text-sm">{project.estimatedTime}</p>
      </div>

      {/* Key Skills Covered */}
      {project.keySkillsCovered && project.keySkillsCovered.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Key Skills Covered:</h4>
          <div className="flex flex-wrap gap-2">
            {project.keySkillsCovered.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Tools/Technologies */}
      {project.suggestedTools && project.suggestedTools.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Suggested Tools:</h4>
          <div className="flex flex-wrap gap-2">
            {project.suggestedTools.map((tool, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Milestones:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            {project.milestones.map((milestone, index) => (
              <li key={index}>{milestone}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bonus Features (Optional) */}
      {project.bonusFeatures && project.bonusFeatures.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Bonus Features:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            {project.bonusFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
