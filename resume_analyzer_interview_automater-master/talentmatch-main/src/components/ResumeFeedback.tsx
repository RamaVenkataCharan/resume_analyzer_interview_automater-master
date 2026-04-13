import React, { useState } from 'react';

interface BulletSuggestion {
  original: string;
  improved: string;
}

interface FeedbackData {
  better_bullets: BulletSuggestion[];
  ats_suggestions: string[];
  general_feedback: string;
}

interface ResumeFeedbackProps {
  resumeText: string;
  jobTitle?: string;
  onFeedbackGenerated?: (feedback: FeedbackData) => void;
}

const ResumeFeedback: React.FC<ResumeFeedbackProps> = ({
  resumeText,
  jobTitle = '',
  onFeedbackGenerated
}) => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateFeedback = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeText,
          jobTitle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const result = await response.json();
      const feedbackData = result.data;
      setFeedback(feedbackData);
      onFeedbackGenerated?.(feedbackData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating feedback');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">✨ Improve Your Resume</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get AI-powered suggestions to enhance your resume, improve ATS compatibility, and increase your chances of getting interviews.
        </p>

        <button
          onClick={handleGenerateFeedback}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Analyzing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Improve My Resume
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-3 text-red-800 text-sm">
            {error}
          </div>
        )}
      </div>

      {feedback && (
        <div className="space-y-6">
          {/* General Feedback */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Overall Assessment</h4>
            <p className="text-blue-800 text-sm">{feedback.general_feedback}</p>
          </div>

          {/* Better Bullet Points */}
          {feedback.better_bullets && feedback.better_bullets.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span>
                Better Bullet Points
              </h4>
              <div className="space-y-3">
                {feedback.better_bullets.map((bullet, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">ORIGINAL</p>
                      <p className="text-sm text-gray-700 line-through opacity-60">
                        {bullet.original}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-semibold mb-1">IMPROVED</p>
                      <div className="bg-green-50 rounded p-2 border border-green-200 mb-2">
                        <p className="text-sm text-green-800">{bullet.improved}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bullet.improved, idx)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                      >
                        {copiedIndex === idx ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Suggestions */}
          {feedback.ats_suggestions && feedback.ats_suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎯</span>
                ATS Optimization Tips
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {feedback.ats_suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                  >
                    <div className="flex gap-2">
                      <span className="text-lg flex-shrink-0">✓</span>
                      <p className="text-sm text-amber-800">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Suggestion */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">💾 Tip:</span> Copy the improved bullet points and replace them in your resume document. This will increase your chances of passing ATS scanners.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFeedback;
