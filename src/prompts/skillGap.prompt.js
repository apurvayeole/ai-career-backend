export const skillGapPrompt = ({ skills, targetRole }) => `
You are an AI Career Coach. Analyze the user's skills and compare them to the skills required for the target job role.

User Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
Target Role: ${targetRole}

Provide a structured skill gap analysis.

Respond ONLY in valid JSON format:

{
  "existingSkills": ["skill1", "skill2"],
  "missingSkills": [{"skill": "skill", "description": "why needed"}, ...],
  "priority": [{"skill": "skill", "level": "High|Medium|Low"}, ...],
  "timeline": [{"skill": "skill", "weeks": 4}, ...],
  "resources": [{"skill": "skill", "youtube": ["url"], "courses": ["course"], "books": ["book"]}, ...]
}

Ensure existing skills are a simple array of strings.
Each missing skill must have skill name and description.
Priority levels are: High, Medium, or Low.
Timeline is in weeks.
`;
