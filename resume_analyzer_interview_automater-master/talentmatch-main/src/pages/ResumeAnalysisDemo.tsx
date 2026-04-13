import React, { useState, useEffect } from 'react';
import ResumeJobMatch from '@/components/ResumeJobMatch';
import SkillGapVisualizer from '@/components/SkillGapVisualizer';
import ResumeFeedback from '@/components/ResumeFeedback';

/**
 * Demo page showing all three new resume analysis features
 * This is a complete working example
 */

interface SkillGapItem {
  skill: string;
  status: 'present' | 'missing';
  icon: string;
}

export default function ResumeAnalysisDemoPage() {
  const [resumeText, setResumeText] = useState(
    `Senior Software Engineer with 8+ years of experience

SKILLS
- Languages: Python, JavaScript, TypeScript, Java
- Frontend: React, Vue.js, Tailwind CSS
- Backend: Node.js, Flask, Django
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
- Tools: Git, Jenkins, GitHub Actions

EXPERIENCE
Senior Software Engineer | TechCorp (2021-Present)
- Led development of microservices architecture processing 1M+ requests daily
- Improved API response time by 40% through optimization and caching
- Mentored 5 junior engineers and led architecture reviews

Full Stack Developer | StartupXYZ (2018-2021)
- Built React component library used across 10+ projects
- Implemented real-time notification system using WebSockets
- Reduced bundle size by 35% through code splitting and optimization

EDUCATION
B.S. Computer Science | State University (2016)`
  );

  const [jobDescription, setJobDescription] = useState(
    `Senior Full Stack Developer
TechCorp Inc. - Remote

We're looking for an experienced full-stack developer to join our platform team.

REQUIREMENTS
- 5+ years of professional software development experience
- Strong proficiency in React and Node.js
- Experience with TypeScript
- AWS cloud platform experience
- PostgreSQL and MongoDB experience
- Docker and Kubernetes knowledge
- CI/CD pipeline experience
- Strong communication skills

NICE TO HAVE
- System design and architecture experience
- Experience with microservices
- Open source contributions
- Tech leadership experience

RESPONSIBILITIES
- Design and implement scalable backend APIs
- Build responsive and performant frontend interfaces
- Participate in code reviews and architecture decisions
- Collaborate with product and design teams
- Mentor junior engineers

BENEFITS
- Competitive salary and equity
- Remote work opportunity
- Professional development budget
- Health insurance
- 4 weeks PTO`
  );

  const [skillGap, setSkillGap] = useState<SkillGapItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Simulated skill gap based on job requirements vs resume
  const requiredSkills = ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'CI/CD', 'System Design'];
  const candidateSkills = resumeText.split('\n').filter(line => {
    const skills = 'Python JavaScript TypeScript Java React Vue Flask Django PostgreSQL MongoDB Redis AWS Docker Kubernetes'.split(' ');
    return skills.some(skill => line.includes(skill));
  });

  const handleAnalysisStart = () => {
    setShowResults(true);
    // Simulate fetching skill gap
    const gap = requiredSkills.map(skill => ({
      skill,
      status: (candidateSkills.some(c => c.includes(skill)) ? 'present' : 'missing') as 'present' | 'missing',
      icon: candidateSkills.some(c => c.includes(skill)) ? '✅' : '❌'
    }));
    setSkillGap(gap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Resume Analysis Suite</h1>
          <p className="text-blue-100">AI-powered resume evaluation, skill gap analysis, and improvement suggestions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Resume Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📄</span>
              Your Resume
            </h2>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              {resumeText.length} characters
            </p>
          </div>

          {/* Job Description Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>💼</span>
              Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              {jobDescription.length} characters
            </p>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalysisStart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 text-lg shadow-lg"
          >
            🚀 Analyze Now
          </button>
          <p className="text-sm text-gray-600 mt-3">
            Click to analyze your resume against the job description
          </p>
        </div>

        {/* Analysis Results */}
        {showResults && (
          <>
            {/* Feature 1: Resume-Job Match Analyzer */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ResumeJobMatch
                resumeText={resumeText}
                jobDescription={jobDescription}
                jobTitle="Senior Full Stack Developer"
                onAnalysisComplete={(analysis) => {
                  console.log('Match analysis:', analysis);
                }}
              />
            </div>

            {/* Feature 2: Skill Gap Visualizer */}
            {skillGap.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <SkillGapVisualizer skillGap={skillGap} />
              </div>
            )}

            {/* Feature 3: Resume Feedback Generator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ResumeFeedback
                resumeText={resumeText}
                jobTitle="Senior Full Stack Developer"
                onFeedbackGenerated={(feedback) => {
                  console.log('Feedback:', feedback);
                }}
              />
            </div>
          </>
        )}

        {/* Info Cards */}
        {!showResults && (
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>📊</span>
                Feature 1: Match Analysis
              </h3>
              <p className="text-blue-800 text-sm">
                Get a 0-100 match score, discover your strengths, and identify missing skills with AI-powered analysis.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span>✅</span>
                Feature 2: Skill Visualization
              </h3>
              <p className="text-purple-800 text-sm">
                See which skills you have (✅) and which ones you need to develop (❌) with visual clarity.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>✨</span>
                Feature 3: Resume Feedback
              </h3>
              <p className="text-green-800 text-sm">
                Get actionable suggestions to improve your resume, enhance ATS compatibility, and stand out.
              </p>
            </div>
          </div>
        )}

        {/* Technical Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">🔧 Technical Details</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ Uses OpenAI's GPT-3.5-turbo for intelligent analysis</li>
            <li>✓ Match score based on skill overlap and job requirements</li>
            <li>✓ ATS (Applicant Tracking System) optimization tips included</li>
            <li>✓ All components are fully responsive and mobile-friendly</li>
            <li>✓ Backend endpoints: /api/analyze/match, /api/analyze/feedback, /api/analyze/skill-gap</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p>Resume Analyzer Suite v1.0 | AI-Powered Career Development</p>
          <p className="text-sm mt-2">For integration guide, see INTEGRATION_GUIDE.md</p>
        </div>
      </div>
    </div>
  );
}
