const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI PR Description generation endpoint
app.post('/api/generate-pr', async (req, res) => {
  try {
    const { diff } = req.body;
    
    if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
      return res.status(400).json({ error: 'Git diff input is required and must be a non-empty string.' });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('API key not configured in environment variables.');
      return res.status(500).json({ error: 'Server configuration error: AI API key not set.' });
    }

    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const prompt = `You are an expert software engineer and technical writer. Analyze the following git diff and generate a professional, structured Pull Request description in Markdown format.

The output must include:
1. **Title Suggestions** (Provide 3 concise, conventional commit titles, e.g. feat:, fix:, refactor:)
2. **What Changed** (Clear bullet points of the modifications made)
3. **Why It Was Done** (The engineering rationale or problem solved)
4. **How to Test / Review** (Testing steps or specific files to inspect)

Git Diff:
\`\`\`diff
${diff.slice(0, 15000)}
\`\`\`
`;

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'You generate precise, high-quality engineering PR descriptions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI API error response:', errorData);
      return res.status(502).json({ error: 'Failed to generate PR description from AI service.' });
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content || 'No description generated.';

    res.json({ success: true, description: resultText });
  } catch (err) {
    console.error('Server error during PR generation:', err);
    res.status(500).json({ error: 'Internal server error while processing git diff.' });
  }
});

app.listen(PORT, () => {
  console.log(`PR Refiner backend server running on port ${PORT}`);
});
