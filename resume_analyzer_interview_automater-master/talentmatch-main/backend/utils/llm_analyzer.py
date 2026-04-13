"""
LLM-based resume and job analysis using OpenAI API
"""
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY', ''))

def analyze_resume_job_match(resume_text: str, job_description: str) -> dict:
    """
    Analyze resume against job description using LLM
    Returns: match_score, strengths, missing_skills, explanation
    """
    prompt = f"""
You are an expert recruiter and career coach. Analyze this resume against the job description and provide a detailed assessment.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return a JSON response with exactly this structure (no markdown, just valid JSON):
{{
    "match_score": <0-100 integer>,
    "strengths": [<top 3 strengths as strings>],
    "missing_skills": [<key missing skills as strings>],
    "explanation": "<1-2 sentence summary of the match>"
}}

Focus on actual skill matching, not generic feedback.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=500
        )
        
        response_text = response.choices[0].message.content.strip()
        # Parse JSON response
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"Error in LLM analysis: {e}")
        return {
            "match_score": 0,
            "strengths": ["Unable to analyze"],
            "missing_skills": ["Error in analysis"],
            "explanation": f"Analysis failed: {str(e)}"
        }


def extract_skills_from_resume(resume_text: str) -> dict:
    """
    Extract and categorize skills from resume text using LLM
    Returns: tech_skills, soft_skills, tools
    """
    prompt = f"""
Extract and categorize skills from this resume. Be specific.

RESUME:
{resume_text}

Return a JSON response:
{{
    "tech_skills": [<list of technical skills>],
    "soft_skills": [<list of soft skills>],
    "tools": [<frameworks, libraries, tools>]
}}
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=400
        )
        
        response_text = response.choices[0].message.content.strip()
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return {"tech_skills": [], "soft_skills": [], "tools": []}


def generate_resume_feedback(resume_text: str, job_title: str = "") -> dict:
    """
    Generate actionable feedback to improve resume
    Returns: better_bullets, ats_suggestions, general_feedback
    """
    job_context = f" for a {job_title} role" if job_title else ""
    
    prompt = f"""
Review this resume{job_context} and provide specific improvements.

RESUME:
{resume_text}

Return a JSON response:
{{
    "better_bullets": [
        {{
            "original": "<original bullet point>",
            "improved": "<better version with metrics and impact>"
        }}
    ],
    "ats_suggestions": [<list of ATS optimization tips>],
    "general_feedback": "<1-2 sentences on overall resume quality>"
}}

Focus on actionable, specific improvements. Use power words and quantifiable metrics.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=800
        )
        
        response_text = response.choices[0].message.content.strip()
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return {
            "better_bullets": [],
            "ats_suggestions": ["Unable to generate suggestions"],
            "general_feedback": f"Error: {str(e)}"
        }


def get_skill_gap_visualization(required_skills: list, candidate_skills: list) -> list:
    """
    Create a skill gap visualization
    Returns: list with skills and status (present/missing)
    """
    visualization = []
    
    for skill in required_skills:
        has_skill = any(
            skill.lower() in c_skill.lower() or c_skill.lower() in skill.lower()
            for c_skill in candidate_skills
        )
        
        visualization.append({
            "skill": skill,
            "status": "present" if has_skill else "missing",
            "icon": "✅" if has_skill else "❌"
        })
    
    return visualization
