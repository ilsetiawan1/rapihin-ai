import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { DOMParser, XMLSerializer } from "xmldom";

const CM_TO_TWIP = 567;
const LINE_SPACING_BASE = 240; // 240 = single spacing in Word XML

function cmToTwip(cm: number): number {
  return Math.round(cm * CM_TO_TWIP);
}

function lineSpacingToXml(spacing: number): string {
  // 1.0 = 240, 1.5 = 360, 2.0 = 480
  return Math.round(spacing * LINE_SPACING_BASE).toString();
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
    const serializer = new XMLSerializer();

    // ── 1. Apply Margins in document.xml ──
    const docXmlFile = zip.file("word/document.xml");
    if (docXmlFile) {
      const xmlStr = await docXmlFile.async("string");
      const doc = parser.parseFromString(xmlStr, "text/xml");

      const pgMars = doc.getElementsByTagName("w:pgMar");
      for (let i = 0; i < pgMars.length; i++) {
        const mar = pgMars[i];
        mar.setAttribute("w:top", cmToTwip(config.marginTop).toString());
        mar.setAttribute("w:bottom", cmToTwip(config.marginBottom).toString());
        mar.setAttribute("w:left", cmToTwip(config.marginLeft).toString());
        mar.setAttribute("w:right", cmToTwip(config.marginRight).toString());
      }

      zip.file("word/document.xml", serializer.serializeToString(doc));
    }

    // ── 2. Apply Font + Spacing in styles.xml ──
    const stylesXmlFile = zip.file("word/styles.xml");
    if (stylesXmlFile) {
      const stylesStr = await stylesXmlFile.async("string");
      const stylesDoc = parser.parseFromString(stylesStr, "text/xml");

      // Find "Normal" style and update its rPr (run properties)
      const styles = stylesDoc.getElementsByTagName("w:style");
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        const styleId = style.getAttribute("w:styleId") || "";

        // Target the "Normal" paragraph style
        if (styleId === "Normal" || styleId === "a") {
          // --- Font ---
          let rPr = style.getElementsByTagName("w:rPr")[0];
          if (!rPr) {
            rPr = stylesDoc.createElement("w:rPr");
            style.appendChild(rPr);
          }

          // Set or update w:rFonts
          let rFonts = rPr.getElementsByTagName("w:rFonts")[0];
          if (!rFonts) {
            rFonts = stylesDoc.createElement("w:rFonts");
            rPr.insertBefore(rFonts, rPr.firstChild);
          }
          rFonts.setAttribute("w:ascii", config.fontFamily);
          rFonts.setAttribute("w:hAnsi", config.fontFamily);
          rFonts.setAttribute("w:cs", config.fontFamily);
          rFonts.setAttribute("w:eastAsia", config.fontFamily);

          // Set font size (in half-points)
          const szVal = (config.fontSize * 2).toString();
          let sz = rPr.getElementsByTagName("w:sz")[0];
          if (!sz) {
            sz = stylesDoc.createElement("w:sz");
            rPr.appendChild(sz);
          }
          sz.setAttribute("w:val", szVal);

          let szCs = rPr.getElementsByTagName("w:szCs")[0];
          if (!szCs) {
            szCs = stylesDoc.createElement("w:szCs");
            rPr.appendChild(szCs);
          }
          szCs.setAttribute("w:val", szVal);

          // --- Line Spacing in pPr ---
          let pPr = style.getElementsByTagName("w:pPr")[0];
          if (!pPr) {
            pPr = stylesDoc.createElement("w:pPr");
            style.insertBefore(pPr, style.firstChild);
          }

          let spacing = pPr.getElementsByTagName("w:spacing")[0];
          if (!spacing) {
            spacing = stylesDoc.createElement("w:spacing");
            pPr.appendChild(spacing);
          }
          spacing.setAttribute("w:line", lineSpacingToXml(config.lineSpacing));
          spacing.setAttribute("w:lineRule", "auto");
        }
      }

      zip.file("word/styles.xml", serializer.serializeToString(stylesDoc));
    }

    // ── 3. Repack and return the file ──
    const outputBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // ── 4. Log Telemetry (fire & forget) ──
    try {
      const { prisma } = await import("@/lib/prisma");
      await (prisma as any).telemetryLog.create({
        data: {
          event: "document_formatted",
          templateId: config.id || "unknown",
          fileName: file.name.slice(-20),
        },
      });
    } catch (_) {
      // Telemetry is non-critical
    }

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="RapihinAI_${file.name}"`,
      },
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json({ error: "Gagal memproses dokumen." }, { status: 500 });
  }
}
