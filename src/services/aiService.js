export async function getAIResponse(chatHistory) {
  try {
    const response = await fetch("https://corsproxy.io/?https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "أنت مساعد مهام فضائية ذكي وودود في لعبة Mission Control. ساعد اللاعب في تصميم مهامه. كن تفاعلياً وأجب على أسئلته بوضوح." },
          ...chatHistory
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
