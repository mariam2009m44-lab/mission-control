import { rockets } from '../data/rockets';
import { components } from '../data/spacecraft';
import { objectives } from '../data/objectives';

export async function getAIResponse(chatHistory) {
  try {
    const gameData = `
    بيانات اللعبة المتاحة (استخدم هذه البيانات فقط ولا تخترع غيرها):
    الصواريخ: ${rockets.map(r => `${r.name} (ID: ${r.id}, الحمولة: ${r.maxPayload}kg, التكلفة: ${r.cost}M)`).join(' | ')}
    المكونات: ${components.map(c => `${c.name} (ID: ${c.id}, الوزن: ${c.mass}kg, الطاقة: ${c.power}W, التكلفة: ${c.cost}M)`).join(' | ')}
    الأهداف: ${objectives.map(o => `${o.name} (ID: ${o.id}, نقاط علمية مطلوبة: ${o.scienceTarget})`).join(' | ')}
    `;

    const systemPrompt = `أنت خبير لعبة Mission Control. مهمتك مساعدة اللاعب في تحليل تصميمه.
    لديك البيانات التالية عن اللعبة: ${gameData}
    
    قواعد صارمة:
    1. أنت خبير لعبة، لست أستاذ فيزياء. ممنوع منعاً باتاً استخدام معلومات فيزيائية من خارج اللعبة.
    2. إذا طلب منك المستخدم عمل امتحان أو اختبار، يجب أن تكون الأسئلة مبنية فقط على الصواريخ والمكونات والأهداف المذكورة في البيانات أعلاه.
    3. لا تخترع أسماء صواريخ أو مكونات غير موجودة في اللعبة.
    4. كن موجزاً ومهنياً واستخدم لغة عربية سليمة.`;

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", 
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory
        ]
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "عذراً، لم أفهم الرد.";
  } catch (error) {
    console.error("AI Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي.";
  }
}
