import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { DOMParser, XMLSerializer } from "xmldom";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const configStr = formData.get("config") as string;

    if (!file || !configStr) {
      return NextResponse.json({ error: "Missing file or configuration" }, { status: 400 });
    }

    const config = JSON.parse(configStr);
    
    // Read the zip (docx) file
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Process document.xml (for margins)
    const docXmlFile = zip.file("word/document.xml");
    if (docXmlFile) {
      const docXmlContent = await docXmlFile.async("string");
      const parser = new DOMParser();
      const doc = parser.parseFromString(docXmlContent, "text/xml");

      // Find all pgMar elements (margins)
      const pgMars = doc.getElementsByTagName("w:pgMar");
      const cmToTwip = 567; // 1 cm = 567 twips
      
      for (let i = 0; i < pgMars.length; i++) {
        const mar = pgMars[i];
        if (config.marginTop) mar.setAttribute("w:top", Math.round(config.marginTop * cmToTwip).toString());
        if (config.marginBottom) mar.setAttribute("w:bottom", Math.round(config.marginBottom * cmToTwip).toString());
        if (config.marginLeft) mar.setAttribute("w:left", Math.round(config.marginLeft * cmToTwip).toString());
        if (config.marginRight) mar.setAttribute("w:right", Math.round(config.marginRight * cmToTwip).toString());
      }

      const serializer = new XMLSerializer();
      const newDocXml = serializer.serializeToString(doc);
      zip.file("word/document.xml", newDocXml);
    }

    // 2. Process styles.xml (for fonts and line spacing if possible)
    // For MVP, modifying margin in document.xml is the most reliable start.
    
    // Repack zip
    const newDocxBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return as downloadable file
    return new Response(newDocxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="RapihinAI_${file.name}"`,
      },
    });

  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json({ error: "Gagal memproses dokumen." }, { status: 500 });
  }
}
