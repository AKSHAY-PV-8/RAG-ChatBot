CREATE TABLE "document" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "document" USING hnsw ("embedding" vector_cosine_ops);