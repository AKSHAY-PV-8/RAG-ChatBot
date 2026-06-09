import { pgTable, serial, text, vector, index } from "drizzle-orm/pg-core";


export const document = pgTable(
    "document",
    {
        id: serial("id").primaryKey(),
        content: text("content").notNull(),
        embedding: vector("embedding", { dimensions: 1536 }),
    },
    (table) => [
        index("embeddingIndex").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops")
        )
    ]
)

export type InsertDocument = typeof document.$inferInsert;
export type SelectDocument = typeof document.$inferSelect;
