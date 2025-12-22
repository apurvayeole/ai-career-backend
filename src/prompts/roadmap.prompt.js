export const roadmapPrompt = ({ goal, duration, currentSkills }) => {
  const weeks = Math.ceil(parseInt(duration) / 7);
  return `
You are an AI Career Mentor. Your task is to generate a practical, realistic, and skill-focused learning roadmap for the user.

Learning Goal: ${goal}
Duration: ${duration} days (${weeks} weeks)
Current Skills: ${Array.isArray(currentSkills) && currentSkills.length > 0 ? currentSkills.join(", ") : "Beginner level"}

Create a structured, actionable roadmap with ${weeks} weeks of content. Do NOT give generic advice.
Instead, produce a goal-specific, skill-focused plan with clear tasks and topics for each week.

Respond ONLY in valid JSON format:

{
  "weeks": [
    {
      "week": 1,
      "focus": "Week focus area",
      "tasks": ["task 1", "task 2", "task 3"],
      "topics": ["topic 1", "topic 2", "topic 3"]
    }
  ]
}

Ensure each week object has: week number, focus (one-line summary), tasks (3-4 actionable items), and topics (3-4 topics to learn).
`;
};
