"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    PromptInput,
    PromptInputBody,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";


export default function RAGChatBot() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status } = useChat(
        // {
        //     api: "/api/chat",
        // }
    );

    console.log("mess", messages);
    console.log("status", status)

    const handleSubmit = (message: PromptInputMessage) => {
        if (!message.text) {
            return;
        }
        sendMessage({
            text: message.text,
        });
        setInput("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full">
                <Conversation className="h-full">
                    <ConversationContent className="">
                        {messages.map((message) => (
                            <div key={message.id} className="">
                                {message.parts.map((part, i) => {
                                    switch (part.type) {
                                        case "text":
                                            return (
                                                <Fragment key={`${message.id}-${i}`} >
                                                    <Message from={message.role} className="">
                                                        <MessageContent>
                                                            {part.text}
                                                        </MessageContent>
                                                    </Message>
                                                </Fragment>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        ))}
                        {(status === "submitted" || status === "streaming") && (
                            <div className="text-sm text-muted-foreground">
                                Thinking...
                            </div>
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <PromptInput onSubmit={handleSubmit} className=" bg-gray-100">
                    <PromptInputBody>
                        <PromptInputTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </PromptInputBody>
                    <PromptInputTools>
                    </PromptInputTools>
                    <PromptInputSubmit disabled={!input && !status} status={status} />
                </PromptInput>
            </div>
        </div>
    );
}