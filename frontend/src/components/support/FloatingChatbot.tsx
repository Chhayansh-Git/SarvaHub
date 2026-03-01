"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Bot, User, Paperclip, MoreHorizontal } from "lucide-react";

export function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 I'm the SarvaHub Support Bot. How can I help you today?", isBot: true, time: "" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Fix hydration error by setting the initial time only on the client
    React.useEffect(() => {
        setMessages(prev => [
            { ...prev[0], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: messages.length + 1,
            text: input,
            isBot: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMsg = {
                id: messages.length + 2,
                text: getBotResponse(input),
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (query: string) => {
        const lowerQ = query.toLowerCase();
        if (lowerQ.includes("return") || lowerQ.includes("exchange")) {
            return "You can initiate a return or exchange directly from your 'My Orders' page. Would you like me to take you there?";
        }
        if (lowerQ.includes("shipping") || lowerQ.includes("track")) {
            return "Standard shipping takes 3-5 business days. Do you have an order number I can look up for you?";
        }
        if (lowerQ.includes("human") || lowerQ.includes("agent") || lowerQ.includes("real person")) {
            return "I understand. Let me connect you with a live support agent. Estimated wait time is 2 minutes. Please hold...";
        }
        return "I'm not quite sure about that. I can search our Help Center or connect you with a human agent. What would you prefer?";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <div
                className={`absolute bottom-20 right-0 w-80 sm:w-96 bg-background border border-border/50 rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-foreground text-background p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 bg-background/20 rounded-full flex items-center justify-center">
                                <Bot className="h-6 w-6 text-background" />
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-foreground rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">SarvaHub Support</h3>
                            <p className="text-xs text-background/70">Typically replies instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="text-background/80 hover:text-background transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/10">
                    <div className="text-center text-xs text-muted-foreground mb-4">Today</div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                            {msg.isBot && (
                                <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="h-4 w-4" />
                                </div>
                            )}
                            <div className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
                                <div
                                    className={`p-3 rounded-2xl text-sm ${msg.isBot
                                        ? 'bg-muted text-foreground rounded-tl-none border border-border/50'
                                        : 'bg-accent text-accent-foreground rounded-tr-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 max-w-[85%] mr-auto">
                            <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted p-3 text-foreground rounded-2xl rounded-tl-none border border-border/50 flex items-center gap-1.5 w-16">
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></span>
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border focus-within:bg-muted/10 transition-colors">
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2 bg-muted/50 border border-border rounded-full p-1 pl-4 focus-within:border-accent/50 focus-within:bg-background transition-all"
                    >
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Paperclip className="h-4 w-4" />
                        </button>
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="h-9 w-9 bg-accent text-accent-foreground rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <Link href="/support/tickets" className="text-xs text-muted-foreground hover:text-accent font-medium transition-colors">
                            Leave a message instead
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className="h-14 w-14 bg-accent text-accent-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-accent/30 relative"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-background"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
