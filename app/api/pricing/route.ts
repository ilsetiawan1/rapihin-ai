import { NextResponse } from "next/server";

export async function GET() {
  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "Rp 0",
      period: "Selamanya",
      description: "Untuk mahasiswa yang hanya butuh perbaikan dasar.",
      features: [
        { text: "Font: Times New Roman", included: true },
        { text: "Batas ukuran file 5 MB", included: true },
        { text: "Kepatuhan Margin & Spasi", included: true },
        { text: "Prioritas Server Normal", included: true },
        { text: "Chat AI Assistant (Limit)", included: false },
      ],
      buttonText: "Paket Saat Ini",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Scholar",
      price: "Rp 29.000",
      period: "per bulan",
      description: "Pilihan terbaik untuk menyelesaikan skripsi lebih cepat.",
      features: [
        { text: "Semua jenis Font (Arial, dll)", included: true },
        { text: "Batas ukuran file 20 MB", included: true },
        { text: "Kepatuhan Margin & Spasi", included: true },
        { text: "Prioritas Server Tinggi (Lebih Cepat)", included: true },
        { text: "Chat AI Assistant (Unlimited)", included: true },
      ],
      buttonText: "Upgrade Sekarang",
      popular: true,
    },
  ];

  return NextResponse.json(plans);
}
