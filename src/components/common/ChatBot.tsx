"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  RefreshCw,
  Leaf,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  showChips?: boolean;
}

interface ApiPayload {
  messages: { role: "user" | "assistant"; content: string }[];
  userName?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INITIAL_QUICK_REPLIES = [
  "Shop Oils",
  "Health Benefits",
  "Track My Order",
  "Bulk Orders",
  "Contact Us",
];

const CONTEXT_CHIPS: Record<string, string[]> = {
  groundnut: ["Buy Groundnut Oil", "Groundnut Oil Benefits", "Compare Oils"],
  coconut: ["Buy Coconut Oil", "Coconut Oil Uses", "Compare Oils"],
  sesame: ["Buy Sesame Oil", "Sesame Oil Benefits", "Compare Oils"],
  shipping: ["Free Delivery Info", "Track My Order", "Return Policy"],
  order: ["Track My Order", "Return Policy", "Contact Support"],
  price: ["View All Products", "Combo Packs", "Bulk Orders"],
  benefit: ["Shop Groundnut Oil", "Shop Coconut Oil", "Shop Sesame Oil"],
};

const ERROR_MESSAGE =
  "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp at +91 98765 43210.";

// ---------------------------------------------------------------------------
// Utility: derive context chips from bot reply
// ---------------------------------------------------------------------------
function deriveChips(content: string): string[] | null {
  const lower = content.toLowerCase();
  for (const [key, chips] of Object.entries(CONTEXT_CHIPS)) {
    if (lower.includes(key)) return chips;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Bot avatar */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
        style={{ background: "var(--color-forest-600, #2d6a4f)" }}
      >
        <Leaf size={14} />
      </div>
      <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full opacity-60"
            style={{
              background: "var(--color-forest-600, #2d6a4f)",
              animation: `minaliya-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onChipClick: (chip: string) => void;
}

function MessageBubble({ message, onChipClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
          style={{ background: "var(--color-forest-600, #2d6a4f)" }}
        >
          <Leaf size={14} />
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
              ? "text-white rounded-br-sm"
              : message.isError
                ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-sm"
                : "bg-white shadow-sm text-gray-800 rounded-bl-sm"
            }`}
          style={
            isUser
              ? { background: "var(--color-forest-600, #2d6a4f)" }
              : undefined
          }
        >
          {message.content}
        </div>

        {/* Quick reply chips */}
        {message.showChips && !isUser && (() => {
          const chips = message.id === "bot-welcome"
            ? INITIAL_QUICK_REPLIES
            : deriveChips(message.content);
          return chips ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onChipClick(chip)}
                  className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 hover:text-white active:scale-95"
                  style={{
                    borderColor: "var(--color-forest-600, #2d6a4f)",
                    color: "var(--color-forest-600, #2d6a4f)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--color-forest-600, #2d6a4f)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-forest-600, #2d6a4f)";
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ChatBot Component
// ---------------------------------------------------------------------------
export default function ChatBot() {
  const pathname = usePathname();
  if (pathname === "/chat" || pathname.startsWith("/admin")) return null;

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-welcome",
      role: "assistant",
      content: user?.name
        ? `Vanakkam, ${user.name}! 🌿 I'm Meena, your Minaliya assistant. How can I help you today?`
        : "Vanakkam! 🌿 I'm Meena, your Minaliya assistant. Ask me anything about our pure cold-pressed oils, orders, or health benefits!",
      showChips: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedPayload, setLastFailedPayload] =
    useState<ApiPayload | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasUnread(false);
    }
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // API call
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (userText: string, payloadOverride?: ApiPayload) => {
      if (!userText.trim() || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userText.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);
      setLastFailedPayload(null);

      const history = [...messages, userMsg]
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      const payload: ApiPayload = payloadOverride ?? {
        messages: history,
        userName: user?.name,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: { reply: string } = await res.json();

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          showChips: true,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errMsg: Message = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: ERROR_MESSAGE,
          isError: true,
        };
        setMessages((prev) => [...prev, errMsg]);
        setLastFailedPayload(payload);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, user?.name]
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSend = () => {
    if (inputValue.trim()) sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleRetry = () => {
    if (!lastFailedPayload) return;
    // Remove the last error message
    setMessages((prev) => prev.filter((m) => !m.isError));
    sendMessage(
      lastFailedPayload.messages[lastFailedPayload.messages.length - 1]
        ?.content ?? "",
      lastFailedPayload
    );
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes minaliya-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes minaliya-fade-scale-in {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes minaliya-fade-scale-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.92) translateY(12px); }
        }
        .minaliya-chat-open {
          animation: minaliya-fade-scale-in 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .minaliya-chat-closed {
          animation: minaliya-fade-scale-out 0.18s ease-in forwards;
          pointer-events: none;
        }
        .minaliya-messages::-webkit-scrollbar { width: 4px; }
        .minaliya-messages::-webkit-scrollbar-track { background: transparent; }
        .minaliya-messages::-webkit-scrollbar-thumb {
          background: var(--color-stone-100, #d6d3d1);
          border-radius: 8px;
        }
      `}</style>

      {/* ── Chat Window ── */}
      <div
        aria-label="Minaliya Customer Chat"
        role="dialog"
        aria-modal="true"
        className={isOpen ? "minaliya-chat-open" : "minaliya-chat-closed"}
        style={{
          position: "fixed",
          bottom: "88px",
          right: "20px",
          width: "360px",
          height: "520px",
          zIndex: 100,
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
          visibility: isOpen ? "visible" : "hidden",
          background: "var(--color-cream-50, #fafaf7)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-forest-600, #2d6a4f) 0%, #1b4332 100%)",
          }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">
              Meena
            </p>
            <p className="text-white/70 text-xs">Minaliya Assistant · Online</p>
          </div>

          <button
            onClick={handleToggle}
            aria-label="Close chat"
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="minaliya-messages flex-1 overflow-y-auto px-4 py-4"
          style={{ background: "var(--color-cream-50, #fafaf7)" }}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onChipClick={handleChipClick}
            />
          ))}

          {isLoading && <TypingIndicator />}

          {/* Retry button */}
          {lastFailedPayload && !isLoading && (
            <div className="flex justify-center mt-2">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-3 py-3 flex-shrink-0 border-t"
          style={{
            borderColor: "var(--color-stone-100, #d6d3d1)",
            background: "#fff",
          }}
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about our oils…"
              aria-label="Type your message"
              className="flex-1 text-sm px-4 py-2.5 rounded-full border outline-none transition-all disabled:opacity-50"
              style={{
                borderColor: "var(--color-stone-100, #d6d3d1)",
                background: "var(--color-cream-50, #fafaf7)",
                color: "#1c1917",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-forest-600, #2d6a4f)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(45,106,79,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-stone-100, #d6d3d1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-150 disabled:opacity-40 hover:opacity-90 active:scale-95"
              style={{ background: "var(--color-forest-600, #2d6a4f)" }}
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-2">
            Powered by Minaliya · Pure. Traditional. Wholesome.
          </p>
        </div>
      </div>

      {/* ── Floating Button ── */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close chat" : "Open chat with Meena"}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 z-[101]"
        style={{ background: "var(--color-forest-600, #2d6a4f)" }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {hasUnread && (
              <span
                className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                aria-label="Unread messages"
              />
            )}
          </>
        )}
      </button>
    </>
  );
}
