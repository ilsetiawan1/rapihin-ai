import { streamText, generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();

    // Check if API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
      // ── MOCK STREAM RESPONSE (No API Key) ──
      const lastMessage = messages[messages.length - 1].content;
      const dummyResponse = getDummyResponse(lastMessage);
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = dummyResponse.split(" ");
          for (let i = 0; i < words.length; i++) {
            await new Promise(r => setTimeout(r, 50)); // simulate typing delay
            // Vercel AI SDK expects a specific format for text streams if we mock it manually,
            // but the easiest way is to use DataStreamResponse from 'ai' or manual chunking.
            // Using ai sdk text stream format: `0:"word "\n`
            controller.enqueue(encoder.encode(`0:"${words[i]} "\n`));
          }
          controller.close();
        },
      });
      return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // ── REAL AI RESPONSE (With API Key) ──
    const systemPrompt = `Kamu adalah AI Assistant RapihinAI yang ahli dalam format dokumen skripsi.
    Tugasmu adalah membantu pengguna mengatur margin, font, spasi baris, dan menjawab pertanyaan seputar pedoman penulisan kampus di Indonesia.
    Gunakan bahasa yang ramah, sopan, dan jelas. Format teks menggunakan markdown jika perlu.`;

    const result = streamText({
      model: google("models/gemini-1.5-pro-latest"),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses pesan." }), { status: 500 });
  }
}

// Dummy Logic for Fallback
const getDummyResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.match(/^(hai|halo|hi|hey)/)) return "Halo! Ada yang bisa saya bantu? Lampirkan file .docx skripsimu dan ceritakan kebutuhanmu. 😊";
  if (lower.includes("margin")) return "Standar margin skripsi yang umum:\n- **Atas:** 4 cm\n- **Kiri:** 4 cm\n- **Bawah:** 3 cm\n- **Kanan:** 3 cm\n\nIngin saya terapkan setting ini ke dokumen kamu?";
  if (lower.includes("spasi")) return "Untuk spasi baris standar skripsi:\n- **Spasi 2.0** untuk isi teks\n- **Spasi 1.0** untuk kutipan langsung\n- **Spasi 1.5** untuk abstrak\n\nIngin saya ubah spasi dokumen kamu?";
  if (lower.includes("font") || lower.includes("huruf")) return "Font akademik yang sering dipakai:\n- **Times New Roman 12pt**\n- **Arial 11pt**\n\nKampusmu menggunakan font apa?";
  if (lower.includes("rapikan") || lower.includes("proses") || lower.includes("format")) return "Siap! Klik tombol **Rapikan Sekarang** di bawah atau lampirkan file .docx kamu terlebih dahulu. 🚀";
  if (lower.includes("konfig") || lower.includes("pengaturan")) return "Membuka panel **Konfigurasi Format**. Kamu bisa atur margin, font, spasi, dan lainnya sesuai panduan kampusmu.";
  return "Saya siap membantu! Kamu bisa tanya tentang format margin, spasi, font, atau langsung lampirkan dokumen .docx untuk dirapikan otomatis.";
};
