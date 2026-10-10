import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, X, Send, Sparkles, HelpCircle, 
  ArrowRight, Scissors, Compass, Calendar, RefreshCcw 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What are your hours & location?",
  "Tell me about the master barbers.",
  "What is the Complete Grooming Package?",
  "How do I schedule an appointment?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to **Apex & Blade**, Gaithersburg's premier grooming sanctuary. I am **Astell**, your digital concierge. How may I assist you with your grooming query today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: userPrompt }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        let serverErrorMsg = "Concurrence issue. Failed to connect with digital concierge.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            serverErrorMsg = errData.error;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(serverErrorMsg);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "I apologize, something went wrong, please try again." },
      ]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I am experiencing temporary connection problems.\n\n**Details**: ${error?.message || "Verify your internet and GEMINI_API_KEY configuration."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Helper helper to render simple markdown-like bold/list styling
  const renderMessageContent = (text: string) => {
    // Escape simple formatting for HTML safety or format basic robust Bold patterns
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let formatted = line;
      // Bold format **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      formatted = formatted.replace(boldRegex, '<strong class="text-gold-300 font-semibold">$1</strong>');
      
      // List check
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      if (isBullet) {
        const cleanContent = line.trim().substring(2);
        const boldClean = cleanContent.replace(boldRegex, '<strong class="text-gold-300 font-semibold">$1</strong>');
        return (
          <li key={i} className="ml-4 list-disc text-slate-300 text-xs my-1" dangerouslySetInnerHTML={{ __html: boldClean }} />
        );
      }

      return (
        <p key={i} className="text-slate-200 text-xs leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div id="concierge-chatbot-root" className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Toggle Button */}
        {!isOpen && (
          <motion.button
            id="chat-trigger-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-slate-900 border border-gold-400/40 text-gold-300 shadow-2xl hover:bg-slate-950 transition-all cursor-pointer relative group"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
            </span>
            <div className="w-6 h-6 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-300">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold font-display pr-1 hidden sm:inline text-slate-100 group-hover:text-gold-400 transition-colors">
              Concierge Astell
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window-container"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="w-[calc(100vw-32px)] sm:w-[380px] h-[520px] bg-[#0c0d0f] border border-gold-400/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-[#121316] px-5 py-4 border-b border-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-slate-950 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-slate-100 text-xs uppercase tracking-wide">
                      Astell
                    </h3>
                    <span className="text-[8px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-1 py-0.2 rounded-full font-bold">
                      Digital Assistant
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-light flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ready to Assist You
                  </p>
                </div>
              </div>
              <button
                id="close-chat-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#09090a]">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 border border-gold-400/20 flex-shrink-0 flex items-center justify-center text-gold-400 text-[10px]">
                        ★
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? "bg-gold-600 text-slate-950 rounded-tr-none font-medium ml-auto"
                          : "bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none mr-auto"
                      }`}
                    >
                      {isUser ? (
                        <p>{m.content}</p>
                      ) : (
                        <div>{renderMessageContent(m.content)}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Streaming loading typing animation */}
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-gold-400/20 flex-shrink-0 flex items-center justify-center text-gold-400 text-[10px] animate-spin-slow">
                    ★
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 pr-1">Astell is typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-5 py-3 border-t border-slate-900 bg-[#09090a]">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-gold-400" /> Suggested Queries:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      id={`chat-starter-${i}`}
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left w-full text-[11px] text-slate-300 hover:text-gold-300 py-1.5 px-3 bg-[#111215] hover:bg-[#15161a] border border-slate-900 hover:border-gold-400/20 rounded-xl transition-all cursor-pointer flex justify-between items-center"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-gold-400/40" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={handleFormSubmit}
              className="p-4 bg-[#121316] border-t border-slate-900 flex gap-2 items-center"
            >
              <input
                id="concierge-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Ask Astell anything about Apex & Blade..."
                className="flex-1 bg-slate-950 border border-slate-900 focus:border-gold-400/40 outline-none text-xs text-slate-200 px-3.5 py-2.5 rounded-xl disabled:opacity-50"
              />
              <button
                id="btn-send-chat"
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gold-600 hover:bg-gold-500 text-slate-950 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
