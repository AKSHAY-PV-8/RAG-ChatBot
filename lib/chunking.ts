import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitters = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 20,
    separators: [" "],
});

export async function chunkContent(content: string) {
    return await textSplitters.splitText(content.trim());
}