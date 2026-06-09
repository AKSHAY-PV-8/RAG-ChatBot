"user server";

import pdf from "pdf-parse";
import { db } from "@/lib/db-config";
import { document } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";

export async function proces