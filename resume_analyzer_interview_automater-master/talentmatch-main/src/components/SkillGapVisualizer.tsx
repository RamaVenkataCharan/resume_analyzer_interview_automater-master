import React, { useState } from 'react';

interface SkillGapItem {
  skill: string;
  status: 'present' | 'missing';
  icon: string;
}

interface SkillGapVisualizerProps {
  skillGap: SkillGapItem[];
  isLoading?: boolean;
}

const SkillGapVisualizer: React.FC<SkillGapVisualizerProps> = ({
  skillGap,
  isLoading = false
}) => {
  const presentSkills = skillGap.filter(s => s.status === 'present');
  const missingSkills = skillGap.filter(s => s.status === 'missing');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const matchPercentage = skillGap.length > 0 
    ? Math.round((presentSkills.length / skillGap.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Skill Match Analysis</h3>
        
        {/* Match Percentage Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Match</span>
            <span className="text-lg font-bold text-blue-600">{matchPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-700 font-semibold">{presentSkills.length} Present</p>
            <p className="text-green-600 text-xs">Have these skills</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700 font-semibold">{missingSkills.length} Missing</p>
            <p className="text-red-600 text-xs">Need to learn</p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {/* Present Skills */}
        {presentSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-lg mr-2">✅</span>
              Your Strengths
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presentSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 border border-green-300 rounded-lg p-3 flex items-center gap-2"
                >
                  <span className="text-lg">✅</span>
                  <span className="text-green-800 font-medium text-sm">{skill.skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-lg mr-2">❌</span>
              Skills to Develop
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {missingSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-center gap-2"
                >
                  <span className="text-lg">❌</span>
                  <span className="text-red-800 font-medium text-sm">{skill.skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Learning Path Suggestion */}
      {missingSkills.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">📚 Recommended Learning Path</h4>
          <p className="text-sm text-blue-800">
            Focus on the "{missingSkills[0].skill}" skill first as it appears frequently in job postings.
            Consider online courses, certifications, or hands-on projects.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillGapVisualizer;
