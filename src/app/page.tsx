"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  provider?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am Itihasa, your storyteller. Ask me anything about the Ramayana or the Mahabharata — characters, stories, or lessons. What would you like to hear?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Something went wrong");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          provider: data.provider,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I could not answer right now. (${err.message})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Namaste! I am Itihasa, your storyteller. Ask me anything about the Ramayana or the Mahabharata. What would you like to hear?",
      },
    ]);
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-amber-200 bg-amber-50">
        <div>
          <h1 className="text-xl font-bold text-amber-900">Itihasa Bot</h1>
          <p className="text-xs text-amber-700">Ramayana & Mahabharata for Kids</p>
        </div>
        <button
          onClick={newChat}
          className="text-sm px-3 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 transition"
        >
          New Chat
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-amber-600 text-white rounded-br-md"
                  : "bg-white border border-amber-100 text-stone-800 rounded-bl-md shadow-sm"
              }`}
            >
              {msg.content}
              {msg.provider && (
                <div className="mt-2 text-[10px] opacity-60">
                  answered by {msg.provider}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-amber-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-stone-500 shadow-sm">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="px-4 py-3 border-t border-amber-200 bg-amber-50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Rama, Krishna, Hanuman, the dice game..."
            className="flex-1 rounded-full border border-amber-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-5 py-2.5 text-sm font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
