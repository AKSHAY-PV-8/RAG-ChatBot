"use server";

import { PDFParse } from "pdf-parse";
import { db } from "@/lib/db-config";
import { document } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    const arrayBuffer = await file.arrayBuffer();

    const parser = new PDFParse({
      data: arrayBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const text = result.text;

    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }

    const chunks = await chunkContent(text);

    const embeddings = await generateEmbeddings(chunks);

    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    await db.insert(document).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("PDF processing error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process PDF",
    };
  }
}