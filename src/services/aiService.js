export async function getAIResponse(userMessage, missionContext) {
  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "أنت مساعد مهام فضائية ذكي في لعبة Mission Control. ساعد اللاعب في تصميم مهامه. كن موجزاً ومهنياً." 
          },
          { 
            role: "user", 
            content: `سياق المهمة: ${JSON.stringify(missionContext)}\n\nسؤال اللاعب: ${userMessage}` 
          }
        ],
        model: "openai"
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else if (typeof data === 'string') {
      return data;
    } else {
      return "عذراً، لم أفهم الرد.";
    }
  } catch (error) {
    console.error("AI Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي. تأكد من اتصالك بالإنترنت.";
  }
}
