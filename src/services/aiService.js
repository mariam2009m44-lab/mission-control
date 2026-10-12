export async function getAIResponse(userMessage, missionContext) {
  try {
    const systemPrompt = "أنت مساعد مهام فضائية ذكي في لعبة Mission Control. ساعد اللاعب في تصميم مهامه. كن موجزاً ومهنياً.";
    const fullPrompt = `${systemPrompt}\n\nسياق المهمة: ${JSON.stringify(missionContext)}\n\nسؤال اللاعب: ${userMessage}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("AI Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي.";
  }
}
