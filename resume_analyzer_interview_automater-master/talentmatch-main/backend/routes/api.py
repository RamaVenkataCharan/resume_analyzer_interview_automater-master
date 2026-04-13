from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime
import uuid
import os
from backend.utils.llm_analyzer import (
    analyze_resume_job_match,
    extract_skills_from_resume,
    generate_resume_feedback,
    get_skill_gap_visualization
)

api_bp = Blueprint('api', __name__)

def api_response(data=None, success=True, message=None, status_code=200):
    """Helper function to format API responses"""
    response = {
        'success': success,
        'timestamp': datetime.utcnow().isoformat(),
    }
    if data is not None:
        response['data'] = data
    if message:
        response['message'] = message
    return jsonify(response), status_code

# For development, use optional JWT
DEV_MODE = os.getenv('FLASK_ENV') == 'development' or os.getenv('DEBUG') == 'true'

# Mock database for demo
MOCK_JOBS = [
    {
        'id': '1',
        'title': 'Senior Full Stack Developer',
        'company': 'TechCorp',
        'location': 'Remote',
        'description': 'Looking for experienced developer...',
        'requirements': ['React', 'TypeScript', 'Node.js', 'AWS'],
        'status': 'open',
        'createdAt': '2024-01-15',
        'applicantCount': 42
    },
    {
        'id': '2', 
        'title': 'AI/ML Engineer',
        'company': 'InnovateAI',
        'location': 'San Francisco, CA',
        'description': 'Join our AI research team...',
        'requirements': ['Python', 'PyTorch', 'TensorFlow', 'MLOps'],
        'status': 'open',
        'createdAt': '2024-01-10',
        'applicantCount': 28
    }
]

MOCK_CANDIDATES = [
    {
        'id': '1',
        'name': 'Alex Johnson',
        'email': 'alex@example.com',
        'resumeText': 'Senior developer with 8 years experience...',
        'skills': ['React', 'TypeScript', 'Node.js', 'AWS', 'Python'],
        'score': 92,
        'matchPercentage': 95,
        'status': 'shortlisted',
        'appliedTo': ['1'],
        'lastUpdated': '2024-01-20'
    }
]

@api_bp.route('/jobs', methods=['GET'])
@jwt_required(optional=True)
def get_jobs():
    claims = get_jwt() or {}
    user_role = claims.get('role', 'admin')  # Default to admin for demo/dev
    
    # Role-based filtering
    if user_role == 'candidate':
        # Candidates see only open jobs
        open_jobs = [job for job in MOCK_JOBS if job['status'] == 'open']
        return api_response(data={'jobs': open_jobs})
    else:
        # Recruiters/admins see all jobs
        return api_response(data={'jobs': MOCK_JOBS})

@api_bp.route('/jobs', methods=['POST'])
@jwt_required(optional=True)
def create_job():
    claims = get_jwt() or {}
    user_role = claims.get('role', 'admin')  # Default to admin for demo/dev
    
    # RBAC check
    if user_role not in ['admin', 'recruiter']:
        return api_response(success=False, message='Insufficient permissions', status_code=403)
    
    data = request.json
    new_job = {
        'id': str(uuid.uuid4()),
        'title': data.get('title'),
        'company': data.get('company', 'Your Company'),
        'location': data.get('location', 'Remote'),
        'description': data.get('description', ''),
        'requirements': data.get('requirements', []),
        'status': 'open',
        'createdAt': datetime.now().isoformat(),
        'applicantCount': 0
    }
    
    MOCK_JOBS.append(new_job)
    return api_response(data={'job': new_job}, message='Job created successfully', status_code=201)

@api_bp.route('/candidates', methods=['GET'])
@jwt_required(optional=True)
def get_candidates():
    claims = get_jwt() or {}
    user_role = claims.get('role', 'admin')  # Default to admin for demo/dev
    
    # RBAC filtering
    if user_role == 'candidate':
        # Candidates only see themselves
        user_email = claims.get('sub')
        user_candidates = [c for c in MOCK_CANDIDATES if c['email'] == user_email]
        return api_response(data={'candidates': user_candidates})
    else:
        # Recruiters/admins see all candidates
        return api_response(data={'candidates': MOCK_CANDIDATES})

@api_bp.route('/ai/match', methods=['POST'])
@jwt_required(optional=True)
def ai_match():
    """AI-powered candidate-job matching"""
    data = request.json
    job_id = data.get('jobId')
    candidate_id = data.get('candidateId')
    
    # Mock AI matching logic
    # In production, this would call OpenAI embeddings + Pinecone
    match_result = {
        'score': 92,
        'breakdown': {
            'skillsMatch': 95,
            'experienceMatch': 88,
            'cultureFit': 85
        },
        'strengths': ['React expertise', 'TypeScript proficiency', 'AWS experience'],
        'weaknesses': ['Limited Python experience', 'No ML background'],
        'interviewQuestions': [
            'How do you optimize React application performance?',
            'Describe your experience with TypeScript generics',
            'How would you design a scalable backend architecture?'
        ]
    }
    
    return api_response(data=match_result)

@api_bp.route('/analytics/overview', methods=['GET'])
@jwt_required(optional=True)
def analytics_overview():
    claims = get_jwt() or {}
    user_role = claims.get('role', 'admin')  # Default to admin for demo/dev
    
    # RBAC: Only admins and hiring managers get analytics
    if user_role not in ['admin', 'recruiter', 'hiring_manager']:
        return api_response(success=False, message='Insufficient permissions', status_code=403)
    
    analytics = {
        'totalCandidates': len(MOCK_CANDIDATES),
        'totalJobs': len(MOCK_JOBS),
        'averageMatchScore': 78,
        'hiringVelocity': '32 days',
        'topSkills': ['React', 'Python', 'TypeScript', 'AWS', 'Node.js'],
        'candidatePipeline': {
            'sourced': 150,
            'screening': 42,
            'interview': 15,
            'offer': 3,
            'hired': 1
        }
    }
    
    return api_response(data=analytics)


# ============================================================
# NEW ENDPOINTS: Resume-Job Match Analysis with LLM
# ============================================================

@api_bp.route('/analyze/match', methods=['POST'])
@jwt_required(optional=True)
def analyze_match():
    """
    Analyze resume against job description using LLM
    Returns: match_score (0-100), strengths, missing_skills, explanation
    """
    data = request.json
    resume_text = data.get('resumeText', '')
    job_description = data.get('jobDescription', '')
    
    if not resume_text or not job_description:
        return api_response(
            success=False,
            message='resumeText and jobDescription are required',
            status_code=400
        )
    
    try:
        analysis = analyze_resume_job_match(resume_text, job_description)
        return api_response(data=analysis, message='Analysis complete')
    except Exception as e:
        return api_response(
            success=False,
            message=f'Analysis failed: {str(e)}',
            status_code=500
        )


@api_bp.route('/analyze/skills', methods=['POST'])
@jwt_required(optional=True)
def extract_skills():
    """
    Extract and categorize skills from resume using LLM
    Returns: tech_skills, soft_skills, tools
    """
    data = request.json
    resume_text = data.get('resumeText', '')
    
    if not resume_text:
        return api_response(
            success=False,
            message='resumeText is required',
            status_code=400
        )
    
    try:
        skills = extract_skills_from_resume(resume_text)
        return api_response(data=skills, message='Skills extracted')
    except Exception as e:
        return api_response(
            success=False,
            message=f'Skills extraction failed: {str(e)}',
            status_code=500
        )


@api_bp.route('/analyze/feedback', methods=['POST'])
@jwt_required(optional=True)
def resume_feedback():
    """
    Generate actionable feedback to improve resume
    Returns: better_bullets, ats_suggestions, general_feedback
    """
    data = request.json
    resume_text = data.get('resumeText', '')
    job_title = data.get('jobTitle', '')
    
    if not resume_text:
        return api_response(
            success=False,
            message='resumeText is required',
            status_code=400
        )
    
    try:
        feedback = generate_resume_feedback(resume_text, job_title)
        return api_response(data=feedback, message='Feedback generated')
    except Exception as e:
        return api_response(
            success=False,
            message=f'Feedback generation failed: {str(e)}',
            status_code=500
        )


@api_bp.route('/analyze/skill-gap', methods=['POST'])
@jwt_required(optional=True)
def skill_gap():
    """
    Create skill gap visualization
    Returns: list of skills with status (present/missing) and icons
    """
    data = request.json
    required_skills = data.get('requiredSkills', [])
    candidate_skills = data.get('candidateSkills', [])
    
    if not required_skills or not candidate_skills:
        return api_response(
            success=False,
            message='requiredSkills and candidateSkills arrays are required',
            status_code=400
        )
    
    try:
        gap = get_skill_gap_visualization(required_skills, candidate_skills)
        return api_response(data={'skillGap': gap}, message='Skill gap analysis complete')
    except Exception as e:
        return api_response(
            success=False,
            message=f'Skill gap analysis failed: {str(e)}',
            status_code=500
        )
