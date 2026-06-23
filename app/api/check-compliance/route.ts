import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { DOMParser } from "xmldom";

// ── Types ──
interface ComplianceItem {
  id: string;
  label: string;
  status: "success" | "warning";
  detected: string;
  expected: string;
  desc: string;
}

interface ComplianceResult {
  items: ComplianceItem[];
  overallStatus: "compliant" | "needs_revision";
  issueCount: number;
}

const CM_TO_TWIP = 567;

function twipToCm(twip: number): number {
  return Math.round((twip / CM_TO_TWIP) * 10) / 10;
}

function parseFontSizeFromHalfPt(halfPt: string | null): number {
  if (!halfPt) return 0;
  return parseInt(halfPt, 10) / 2;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const configStr = formData.get("config") as string;

    if (!file || !configStr) {
      return NextResponse.json({ error: "Missing file or configuration" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json({ error: "Hanya file .docx yang didukung." }, { status: 400 });
    }

    const config = JSON.parse(configStr);
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const parser = new DOMParser();

    const items: ComplianceItem[] = [];

    // ── 1. Margin Check ─────────────────────────────────────────
    const docXmlFile = zip.file("word/document.xml");
    let detectedMargin = "Tidak terdeteksi";
    let marginStatus: "success" | "warning" = "warning";

    if (docXmlFile) {
      const xmlStr = await docXmlFile.async("string");
      const doc = parser.parseFromString(xmlStr, "text/xml");
      const pgMars = doc.getElementsByTagName("w:pgMar");

      if (pgMars.length > 0) {
        const mar = pgMars[0];
        const top = twipToCm(parseInt(mar.getAttribute("w:top") || "0", 10));
        const bottom = twipToCm(parseInt(mar.getAttribute("w:bottom") || "0", 10));
        const left = twipToCm(parseInt(mar.getAttribute("w:left") || "0", 10));
        const right = twipToCm(parseInt(mar.getAttribute("w:right") || "0", 10));

        detectedMargin = `Atas ${top}cm, Kiri ${left}cm, Bawah ${bottom}cm, Kanan ${right}cm`;

        const tolerance = 0.1;
        marginStatus =
          Math.abs(top - config.marginTop) < tolerance &&
          Math.abs(bottom - config.marginBottom) < tolerance &&
          Math.abs(left - config.marginLeft) < tolerance &&
          Math.abs(right - config.marginRight) < tolerance
            ? "success"
            : "warning";
      }
    }

    items.push({
      id: "margin",
      label: "Batas Margin Halaman",
      status: marginStatus,
      detected: detectedMargin,
      expected: `Atas ${config.marginTop}cm, Kiri ${config.marginLeft}cm, Bawah ${config.marginBottom}cm, Kanan ${config.marginRight}cm`,
      desc:
        marginStatus === "success"
          ? "Margin halaman sesuai dengan standar yang dipilih."
          : "Margin dokumen saat ini tidak sesuai standar. Akan disesuaikan saat rapikan.",
    });

    // ── 2. Font & Spacing Check ──────────────────────────────────
    const stylesXmlFile = zip.file("word/styles.xml");
    let detectedFont = "Tidak terdeteksi";
    let detectedSpacing = "Tidak terdeteksi";
    let fontStatus: "success" | "warning" = "warning";
    let spacingStatus: "success" | "warning" = "warning";

    if (stylesXmlFile) {
      const stylesStr = await stylesXmlFile.async("string");
      const stylesDoc = parser.parseFromString(stylesStr, "text/xml");

      // Find "Normal" / "Default" paragraph style
      const styles = stylesDoc.getElementsByTagName("w:style");
      let normalStyle: Element | null = null;
      for (let i = 0; i < styles.length; i++) {
        const s = styles[i];
        const styleId = s.getAttribute("w:styleId") || "";
        if (styleId === "Normal" || styleId === "a" || styleId === "Default Paragraph Font") {
          normalStyle = s;
          break;
        }
      }

      if (normalStyle) {
        // Font detection
        const rFonts = normalStyle.getElementsByTagName("w:rFonts")[0];
        if (rFonts) {
          const fontName =
            rFonts.getAttribute("w:ascii") ||
            rFonts.getAttribute("w:hAnsi") ||
            rFonts.getAttribute("w:eastAsia") ||
            "Unknown";
          detectedFont = fontName;
          fontStatus = fontName === config.fontFamily ? "success" : "warning";
        }

        // Spacing detection (line spacing)
        const spacing = normalStyle.getElementsByTagName("w:spacing")[0];
        if (spacing) {
          const lineAttr = spacing.getAttribute("w:line");
          if (lineAttr) {
            const lineVal = parseInt(lineAttr, 10);
            // 240 = single (1.0), 360 = 1.5, 480 = double (2.0) — in twentieths of a point
            const detectedSpacingNum = Math.round((lineVal / 240) * 10) / 10;
            detectedSpacing = `${detectedSpacingNum} Spasi`;
            spacingStatus =
              Math.abs(detectedSpacingNum - config.lineSpacing) < 0.1 ? "success" : "warning";
          }
        }
      }
    }

    if (detectedFont === "Tidak terdeteksi") {
      // Fallback: scan document body
      if (docXmlFile) {
        const xmlStr = await docXmlFile.async("string");
        const doc = parser.parseFromString(xmlStr, "text/xml");
        const rFontsEls = doc.getElementsByTagName("w:rFonts");
        if (rFontsEls.length > 0) {
          const fontName =
            rFontsEls[0].getAttribute("w:ascii") ||
            rFontsEls[0].getAttribute("w:hAnsi") ||
            "Campuran";
          detectedFont = fontName;
          fontStatus = fontName === config.fontFamily ? "success" : "warning";
        }
      }
    }

    items.push({
      id: "font",
      label: "Tipe & Ukuran Font Utama",
      status: fontStatus,
      detected: detectedFont === "Tidak terdeteksi" ? "Campuran / Tidak Terdeteksi" : detectedFont,
      expected: `${config.fontFamily} ${config.fontSize}pt`,
      desc:
        fontStatus === "success"
          ? "Font utama dokumen sesuai standar yang dipilih."
          : "Font tidak seragam atau tidak sesuai standar. Akan diseragamkan saat rapikan.",
    });

    items.push({
      id: "spacing",
      label: "Spasi Baris (Line Spacing)",
      status: spacingStatus,
      detected: detectedSpacing,
      expected: `${config.lineSpacing} Spasi`,
      desc:
        spacingStatus === "success"
          ? "Spasi baris dokumen sesuai standar yang dipilih."
          : "Spasi baris tidak sesuai standar. Akan diseseragamkan saat rapikan.",
    });

    // ── 3. Chapter Structure Check (Regex) ───────────────────────
    let structureStatus: "success" | "warning" = "warning";
    let structureDetected = "Struktur bab tidak terdeteksi";

    if (docXmlFile) {
      const xmlStr = await docXmlFile.async("string");
      // Extract all text content
      const textMatches = xmlStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
      const plainText = textMatches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ");

      const babPattern = /BAB\s+(I{1,3}|IV|V|VI|VII|VIII|IX|X|[1-9])/gi;
      const subBabPattern = /\d+\.\d+\s+\w+/g;
      const daftarPustakaPattern = /DAFTAR\s+PUSTAKA|REFERENSI|BIBLIOGRAPHY/gi;

      const babMatches = plainText.match(babPattern) || [];
      const subBabMatches = plainText.match(subBabPattern) || [];
      const daftarPustaka = daftarPustakaPattern.test(plainText);

      if (babMatches.length > 0) {
        structureStatus = "success";
        const uniqueBabs = [...new Set(babMatches.map((b) => b.toUpperCase()))];
        structureDetected = `${uniqueBabs.slice(0, 3).join(", ")}${uniqueBabs.length > 3 ? "..." : ""} terdeteksi`;
        if (subBabMatches.length > 0) {
          structureDetected += ` · ${subBabMatches.length} sub-bab`;
        }
        if (daftarPustaka) {
          structureDetected += " · Daftar Pustaka ✓";
        }
      }
    }

    items.push({
      id: "structure",
      label: "Struktur Penulisan Bab",
      status: structureStatus,
      detected: structureDetected,
      expected: "Struktur Bab Terbaca (BAB I, II, dst.)",
      desc:
        structureStatus === "success"
          ? "Sistem berhasil mengidentifikasi bab dan sub-bab menggunakan analisis teks."
          : "Struktur bab standar tidak ditemukan. Pastikan penulisan bab menggunakan format 'BAB I', 'BAB II', dst.",
    });

    const issueCount = items.filter((i) => i.status === "warning").length;

    const result: ComplianceResult = {
      items,
      overallStatus: issueCount === 0 ? "compliant" : "needs_revision",
      issueCount,
    };

    // ── Log Telemetry (fire & forget) ────────────────────────────
    try {
      const { prisma } = await import("@/lib/prisma");
      await (prisma as any).activity.create({
        data: {
          actionType: "COMPLIANCE_CHECK",
          fileSize: file.size,
          status: "SUCCESS",
        },
      });
    } catch (_) {
      // Telemetry is non-critical; don't fail the request
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Compliance check error:", error);
    return NextResponse.json({ error: "Gagal menganalisis dokumen." }, { status: 500 });
  }
}
