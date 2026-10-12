import { GAME_KNOWLEDGE } from '../data/gameKnowledge';

export async function getAIResponse(chatHistory) {
  try {
    const systemPrompt = `أنت خبير لعبة Mission Control. حلل تصميم اللاعب بناءً على البيانات دي:

${GAME_KNOWLEDGE}

قواعد:
1. استخدم الصواريخ والمكونات المذكورة بس.
2. ممنوع اختراع أسماء من عندك.
3. ردودك موجزة ومهنية بالعربي.`;

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory
        ]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "عذراً، لم أفهم الرد.";
  } catch (error) {
    console.error("AI Error:", error);
    return `عذراً، حدث خطأ: ${error.message}`;
  }
}
