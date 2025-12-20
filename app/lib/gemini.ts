import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function evaluateCV(cvText: string, position: string): Promise<{ score: number; analysis: string }> {
  const prompt = `Sen bir İK uzmanısın. Aşağıdaki CV'yi "${position}" pozisyonu için değerlendir.

CV:
${cvText}

Şu formatta JSON döndür (başka hiçbir şey yazma):
{
  "score": 0-100 arası puan,
  "analysis": "Türkçe detaylı analiz. Güçlü yönler, zayıf yönler ve öneriler içersin. 3-4 cümle."
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // JSON'ı parse et
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return { score: 0, analysis: "Değerlendirme yapılamadı." };
}

export async function suggestTicketSolution(subject: string, description: string): Promise<string> {
  const prompt = `Sen bir müşteri destek uzmanısın. Aşağıdaki destek talebine Türkçe çözüm önerisi sun.

Konu: ${subject}
Açıklama: ${description}

Kısa ve net bir çözüm önerisi yaz (2-3 cümle):`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateSalesForecast(salesData: { date: string; total: number }[]): Promise<string> {
  const prompt = `Sen bir satış analisti olarak çalışıyorsun. Aşağıdaki satış verilerine göre önümüzdeki hafta için Türkçe tahmin ve öneriler sun.

Son satış verileri:
${salesData.map(s => `${s.date}: ${s.total} TL`).join('\n')}

Kısa bir analiz ve tahmin yaz (3-4 cümle):`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}