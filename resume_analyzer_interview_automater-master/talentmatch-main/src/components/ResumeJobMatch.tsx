import React, { useState } from 'react';

interface MatchAnalysisData {
  match_score: number;
  strengths: string[];
  missing_skills: string[];
  explanation: string;
}

interface ResumeJobMatchProps {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  onAnalysisComplete?: (analysis: MatchAnalysisData) => void;
}

const ResumeJobMatch: React.FC<ResumeJobMatchProps> = ({
  resumeText,
  jobDescription,
  jobTitle = 'Job Position',
  onAnalysisComplete
}) => {
  const [analysis, setAnalysis] = useState<MatchAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAutomatic] = useState(true); // Auto-analyze when both texts are available

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeText,
          jobDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze match');
      }

      const result = await response.json();
      const analysisData = result.data;
      setAnalysis(analysisData);
      onAnalysisComplete?.(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analyzing match');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  // Auto-analyze on component mount or when both texts change
  React.useEffect(() => {
    if (isAutomatic && resumeText.trim() && jobDescription.trim() && !analysis) {
      handleAnalyze();
    }
  }, [resumeText, jobDescription]);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Resume-Job Match Analysis</h3>
        <p className="text-sm text-gray-600">AI-powered analysis using LLM technology</p>
      </div>

      {!analysis && !loading && (
        <button
          onClick={handleAnalyze}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Analyze Match
        </button>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-red-800 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
          <p className="text-center text-gray-600 text-sm">🤖 Analyzing your resume against the job description...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Match Score Card */}
          <div className={`bg-gradient-to-br ${getScoreColor(analysis.match_score)} rounded-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90">Match Score</p>
                <p className="text-5xl font-bold">{analysis.match_score}</p>
                <p className="text-sm opacity-90 mt-1">{getScoreLabel(analysis.match_score)}</p>
              </div>
              <div className="text-6xl opacity-80">
                {analysis.match_score >= 80 ? '🎯' : analysis.match_score >= 60 ? '👍' : '⚠️'}
              </div>
            </div>
          </div>

          {/* Quick Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Overview</h4>
            <p className="text-sm text-blue-800">{analysis.explanation}</p>
          </div>

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>✅</span>
                Your Strengths ({analysis.strengths.length})
              </h4>
              <div className="space-y-2">
                {analysis.strengths.map((strength, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 border border-green-300 rounded-lg p-3 flex items-start gap-3"
                  >
                    <span className="text-lg flex-shrink-0">💪</span>
                    <span className="text-green-800 text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {analysis.missing_skills && analysis.missing_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚠️</span>
                Skills to Develop ({analysis.missing_skills.length})
              </h4>
              <div className="space-y-2">
                {analysis.missing_skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-3"
                  >
                    <span className="text-lg flex-shrink-0">📚</span>
                    <span className="text-amber-800 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">📌 Recommendation:</span>
              {analysis.match_score >= 80
                ? " You're a great fit! Consider applying to this position."
                : analysis.match_score >= 60
                ? " You have most required skills. Consider upskilling on missing areas before applying."
                : " This might not be the best fit yet. Focus on developing the missing skills first."}
            </p>
          </div>

          {/* Analyze Again Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
          >
            Analyze Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeJobMatch;
