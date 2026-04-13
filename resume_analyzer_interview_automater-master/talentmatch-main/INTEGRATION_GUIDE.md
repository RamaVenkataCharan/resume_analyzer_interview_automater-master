# Resume Analyzer Features Integration Guide

## Overview
This guide shows how to integrate the three new resume analysis features into your application.

## Features Added

### 1. **Resume-Job Match Analyzer** (`ResumeJobMatch.tsx`)
Analyzes a candidate's resume against a job description using LLM technology.

**Returns:**
- Match Score (0-100)
- Top 3 Strengths
- Missing Skills
- Explanation

**Usage:**
```tsx
import ResumeJobMatch from '@/components/ResumeJobMatch';

<ResumeJobMatch 
  resumeText={candidateResume}
  jobDescription={jobDetails.description}
  jobTitle={jobDetails.title}
  onAnalysisComplete={(analysis) => {
    console.log(`Match Score: ${analysis.match_score}`);
    console.log(`Strengths:`, analysis.strengths);
  }}
/>
```

**API Endpoint:**
```
POST /api/analyze/match
Body: {
  resumeText: string,
  jobDescription: string
}
Response: {
  match_score: 0-100,
  strengths: string[],
  missing_skills: string[],
  explanation: string
}
```

---

### 2. **Skill Gap Visualizer** (`SkillGapVisualizer.tsx`)
Visual representation of skills with ✅/❌ indicators.

**Features:**
- Overall match percentage bar
- Categorized skill display (Present/Missing)
- Learning path recommendations

**Usage:**
```tsx
import SkillGapVisualizer from '@/components/SkillGapVisualizer';

const skillGap = [
  { skill: 'Python', status: 'present', icon: '✅' },
  { skill: 'System Design', status: 'missing', icon: '❌' },
  { skill: 'React', status: 'present', icon: '✅' },
  { skill: 'Docker', status: 'missing', icon: '❌' }
];

<SkillGapVisualizer 
  skillGap={skillGap}
  isLoading={false}
/>
```

**API Endpoint:**
```
POST /api/analyze/skill-gap
Body: {
  requiredSkills: string[],
  candidateSkills: string[]
}
Response: {
  skillGap: [
    { skill: string, status: 'present'|'missing', icon: string }
  ]
}
```

---

### 3. **Resume Feedback Generator** (`ResumeFeedback.tsx`)
Generates actionable resume improvements using an LLM.

**Returns:**
- Better Bullet Points (with copy functionality)
- ATS Optimization Tips
- General Feedback

**Usage:**
```tsx
import ResumeFeedback from '@/components/ResumeFeedback';

<ResumeFeedback 
  resumeText={candidateResume}
  jobTitle="Senior Developer"
  onFeedbackGenerated={(feedback) => {
    console.log('Bullet suggestions:', feedback.better_bullets);
    console.log('ATS tips:', feedback.ats_suggestions);
  }}
/>
```

**API Endpoint:**
```
POST /api/analyze/feedback
Body: {
  resumeText: string,
  jobTitle?: string
}
Response: {
  better_bullets: [
    {
      original: string,
      improved: string
    }
  ],
  ats_suggestions: string[],
  general_feedback: string
}
```

---

## Integration Example - Complete Page

```tsx
import React, { useState } from 'react';
import ResumeJobMatch from '@/components/ResumeJobMatch';
import SkillGapVisualizer from '@/components/SkillGapVisualizer';
import ResumeFeedback from '@/components/ResumeFeedback';

export default function CandidateAnalysisPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skillGap, setSkillGap] = useState([]);

  const handleMatchAnalysis = async (analysis: any) => {
    // After match analysis, fetch skill gap
    console.log('Match analysis:', analysis);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Resume Analysis Portal</h1>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here..."
            className="w-full h-48 p-4 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-48 p-4 border rounded-lg"
          />
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Match Analyzer */}
        <ResumeJobMatch 
          resumeText={resumeText}
          jobDescription={jobDescription}
          onAnalysisComplete={handleMatchAnalysis}
        />

        {/* Skill Gap */}
        <SkillGapVisualizer 
          skillGap={skillGap}
        />
      </div>

      {/* Resume Feedback */}
      <ResumeFeedback 
        resumeText={resumeText}
        jobTitle="Senior Software Engineer"
      />
    </div>
  );
}
```

---

## Backend Setup

### 1. Environment Variables
Add this to your `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Python Requirements
Ensure `openai` package is in your `requirements.txt`:
```
openai==1.12.0
```

### 3. API Routes Registered
All routes are automatically registered in `backend/routes/api.py`:

```
POST /api/analyze/match          # Resume-job matching
POST /api/analyze/skills         # Extract skills from resume
POST /api/analyze/feedback       # Generate resume feedback
POST /api/analyze/skill-gap      # Get skill gap visualization
```

---

## Component Props

### ResumeJobMatch
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| resumeText | string | Yes | Full resume text |
| jobDescription | string | Yes | Job description text |
| jobTitle | string | No | Optional job title for context |
| onAnalysisComplete | function | No | Callback when analysis finishes |

### SkillGapVisualizer
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| skillGap | array | Yes | Array of skill objects with status |
| isLoading | boolean | No | Show loading skeleton |

### ResumeFeedback
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| resumeText | string | Yes | Resume text to analyze |
| jobTitle | string | No | Job title for context |
| onFeedbackGenerated | function | No | Callback when feedback is ready |

---

## Features Breakdown

### Match Score Visualization
- **0-40:** Poor Match (Red) - ⚠️
- **40-60:** Fair Match (Orange) - 👍
- **60-80:** Good Match (Yellow) - ✓
- **80-100:** Excellent Match (Green) - 🎯

### Skill Status Icons
- ✅ Present - Candidate has this skill
- ❌ Missing - Candidate needs to develop this skill

### ATS Optimization Tips
Common tips generated:
- Use standard formatting
- Include relevant keywords from job description
- Quantify achievements with metrics
- Use action verbs
- Keep to one page (for junior roles)
- Use standard fonts

---

## Error Handling

All components include error states:

```tsx
// If no API key is configured
{
  "success": false,
  "message": "OPENAI_API_KEY not configured"
}

// If required fields are missing
{
  "success": false,
  "message": "resumeText and jobDescription are required"
}
```

---

## Performance Notes

- **LLM Calls:** Each analysis makes 1 API call to OpenAI (uses gpt-3.5-turbo)
- **Response Time:** Typically 2-5 seconds per analysis
- **Token Usage:** ~200-400 tokens per analysis
- **Cost:** ~$0.001-0.005 per analysis at current OpenAI rates

Consider implementing:
- Response caching for identical inputs
- Rate limiting to prevent abuse
- Batch processing for multiple candidates

---

## Deployment Checklist

- [ ] Add `OPENAI_API_KEY` to environment variables
- [ ] Test endpoints locally with `curl` or Postman
- [ ] Check token limits and rate limiting setup
- [ ] Update API documentation
- [ ] Add error logging
- [ ] Test all three components on target browser
- [ ] Verify JWT auth is working (if required)

---

## Future Enhancements

1. **Caching:** Store analysis results for identical resume/job pairs
2. **Batch Analysis:** Analyze multiple candidates at once
3. **Historical Tracking:** Track how resumes improve over time
4. **Custom Metrics:** Allow recruiters to define custom match criteria
5. **Resume Templates:** Suggest best templates based on industry
6. **Interview Question Generation:** Generate interview questions based on gap analysis

---

## Support & Troubleshooting

**Q: Components not showing?**
A: Ensure Tailwind CSS is configured in your `tailwind.config.js`

**Q: API endpoints returning 401?**
A: Check that JWT token is properly stored in localStorage

**Q: LLM responses are slow?**
A: Normal for gpt-3.5-turbo. Consider upgrading to gpt-4 for better quality but slower responses

**Q: Getting JSON parsing errors?**
A: Ensure OpenAI API key is valid and has available credits
