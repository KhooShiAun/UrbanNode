import 'dotenv/config';

async function testModel(modelName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const prompt = "Say 'Hello'";
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      })
    });
    
    console.log(`Model: ${modelName} -> Status: ${response.status}`);
    const text = await response.text();
    console.log(`Response text length: ${text.length}`);
    if (response.status !== 200) {
      console.log("Error details:", text);
    }
  } catch (error) {
    console.error(`Fetch error for ${modelName}:`, error);
  }
}

async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-2.0-flash');
  await testModel('gemini-2.5-flash');
}

run();
