export type Severity = 'low' | 'routine' | 'urgent' | 'uncategorised';

interface AICategorization {
  severity: Severity;
  reasoning: string;
}

/**
 * Automatically categorizes the severity of a report description using Google Gemini API.
 * Uses Structured JSON Output mode to guarantee the shape.
 * Falls back to 'uncategorised' if a connection error occurs, API key is missing, or parsing fails.
 */
export async function classifyReport(description: string): Promise<Severity> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('AI Helper: GEMINI_API_KEY is not defined. Falling back to "uncategorised".');
    return 'uncategorised';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an urban maintenance assistant. Your job is to classify the severity of citizens' infrastructure reports.
Classify the report description into one of these categories:
- "low": Infrastructure has minor wear and tear but does NOT impact usability or safety (e.g., paint peeling, faded signs, scuffed park benches).
- "routine": Functional or hygiene disruption that always needs scheduled maintenance but doesn't pose immediate hazard (e.g., overflowing trash bins, potholes, street lights out, broken swings).
- "urgent": Infrastructure issues that pose an immediate physical danger to public safety (e.g., shattered glass, fallen power lines, collapsed structures, exposed wiring).
- "uncategorised": The description is too vague, filled with slang/typos you do not understand, or otherwise impossible to classify.

Report Description: "${description.replace(/"/g, '\\"')}"
`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              severity: {
                type: 'STRING',
                enum: ['low', 'routine', 'urgent', 'uncategorised'],
              },
              reasoning: {
                type: 'STRING',
                description: 'Brief explanation for why this severity was chosen.',
              },
            },
            required: ['severity'],
          },
        },
      }),
    });

    if (!response.ok) {
      console.error(`AI Helper: Gemini API returned status ${response.status}`);
      return 'uncategorised';
    }

    const data = (await response.json()) as any;
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      console.warn('AI Helper: Empty response from Gemini API.');
      return 'uncategorised';
    }

    const result: AICategorization = JSON.parse(jsonText);
    return result.severity || 'uncategorised';
  } catch (error) {
    console.error('AI Helper Error:', error);
    // Fallback behaviour as per requirements
    return 'uncategorised';
  }
}
