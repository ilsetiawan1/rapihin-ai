import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest } from "next/server";

export const maxDuration = 30;

const SYSTEM_PROMPT = `Kamu adalah AI Assistant RapihinAI yang ahli dalam format dokumen akademik (skripsi, tesis, laporan KP).
Tugasmu adalah membantu pengguna mengatur margin, font, spasi baris, dan menjawab pertanyaan seputar pedoman penulisan kampus di Indonesia.
Gunakan bahasa yang ramah, sopan, dan ringkas. Format respons menggunakan markdown jika perlu.
Jika ada file yang dilampirkan oleh pengguna, berikan panduan spesifik tentang cara memperbaiki dokumen tersebut.`;

// ── Fallback dummy responses (no API key) ──
function getDummyResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/^(hai|halo|hi|hey)/)) return "Halo! Ada yang bisa saya bantu? Lampirkan file .docx skripsimu dan ceritakan kebutuhanmu. 😊";
  if (lower.includes("margin")) return "Standar margin skripsi yang umum:\n- **Atas:** 4 cm\n- **Kiri:** 4 cm\n- **Bawah:** 3 cm\n- **Kanan:** 3 cm\n\nIngin saya terapkan setting ini ke dokumen kamu?";
  if (lower.includes("spasi")) return "Untuk spasi baris standar skripsi:\n- **Spasi 2.0** untuk isi teks\n- **Spasi 1.0** untuk kutipan langsung\n- **Spasi 1.5** untuk abstrak\n\nIngin saya ubah spasi dokumen kamu?";
  if (lower.includes("font") || lower.includes("huruf")) return "Font akademik yang sering dipakai:\n- **Times New Roman 12pt** (paling umum)\n- **Arial 11pt**\n- **Calibri 12pt**\n\nKampusmu menggunakan font apa?";
  if (lower.includes("rapikan") || lower.includes("proses") || lower.includes("format")) return "Siap! Klik tombol **Rapikan Sekarang** di bawah atau lampirkan file .docx kamu terlebih dahulu. 🚀";
  if (lower.includes("konfig") || lower.includes("pengaturan")) return "Membuka panel **Konfigurasi Format**. Kamu bisa atur margin, font, spasi, dan lainnya sesuai panduan kampusmu.";
  if (lower.includes("terima kasih") || lower.includes("makasih")) return "Sama-sama! Semoga skripsinya lancar dan cepat selesai ya! 🎓✨";
  return "Saya siap membantu! Kamu bisa tanya tentang format margin, spasi, font, atau langsung lampirkan dokumen .docx untuk dirapikan otomatis.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    // ── Mock stream if no API key ──
    const hasGeminiKey =
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key";

    if (!hasGeminiKey) {
      const lastMessage = messages[messages.length - 1]?.content ?? "";
      const reply = getDummyResponse(lastMessage);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Stream word by word for ChatGPT-like effect
          const words = reply.split(" ");
          for (const word of words) {
            await new Promise((r) => setTimeout(r, 40));
            // Vercel AI SDK text stream format
            controller.enqueue(encoder.encode(`0:"${word.replace(/"/g, '\\"')} "\n`));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "x-vercel-ai-data-stream": "v1",
        },
      });
    }

    // ── Real Gemini AI ──
    const result = streamText({
      model: google("models/gemini-1.5-pro-latest"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat memproses pesan." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
