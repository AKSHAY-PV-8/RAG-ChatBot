"user server";

import pdf from "pdf-parse";
import { db } from "@/lib/db-config";
import { document } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";
import { success } from "zod/v4";

export async function processPdfFile(formdata: FormData) {
    try {
        const file = formdata.get("pdf") as File;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const data = await pdf(buffer);

        if (!data.text || data.text.trim().length === 0) {
            return {
                success: false,
                error: "No text found in PDF",
            };
        }

        const chunks = await chunkContent(data.text);
        const embeddings = await generateEmbeddings(chunks);

        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
        }));

        await db.insert(document).values(records);

    } catch (error) {
        console.error("PDF processing error", error);
        return {
            success: false,
            error: "Failed to process PDF"
        };
    }
}