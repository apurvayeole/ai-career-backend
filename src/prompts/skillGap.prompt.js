export const skillGapPrompt = ({ skills, targetRole }) => `
You are an AI Career Coach. Analyze the user's skills and compare them to the skills required for the target job role.

User Skills: ${skills.join(", ")}
Target Role: ${targetRole}

Provide the following in a clear structured format:

1. Skills the user already has
2. Skills the user is missing
3. Priority order of missing skills
4. Estimated timeline to learn each skill
5. Recommended learning resources (YouTube, courses, books)

Respond in JSON format:
{
  "existingSkills": [],
  "missingSkills": [],
  "priority": [],
  "timeline": [],
  "resources": []
}
`;
