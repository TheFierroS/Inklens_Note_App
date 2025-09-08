import React, { useState, useRef, useEffect } from "react";
import useTheme from "../context/useTheme";
import { FiSend } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

const PROMPTS = [
    { label: "Summarize Note", text: "This note is long, summarize it briefly." },
    { label: "To-do List", text: "Extract tasks from this note and make a checklist using - [ ] format." },
    { label: "Formal Tone", text: "Rewrite this note in a more professional tone." },
    { label: "Casual Tone", text: "Rewrite this note in a more casual and friendly tone." },
    { label: "Translate to English", text: "Translate this note into English." },
    { label: "Translate to Turkish", text: "Translate this note into Turkish." }
];

const AiChatModal = ({ isOpen, onClose, note, userId, onSaveNote }) => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            const timer = setTimeout(() => setShow(true), 20);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
            const timer = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const content = (text ?? input).trim();
        if (!content) return;

        const userMsg = { role: "user", content };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    note: note?.content || ""
                })
            });

            const data = await res.json();
            const aiMsg = {
                role: "assistant",
                content: typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply)
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: "assistant", content: "Network error." }]);
        } finally {
            setLoading(false);
        }
    };

    
    const saveAsNote = async (content, type = "new") => {
        if (!userId) return;

        try {
            let res;

            if (type === "new") {
                res = await fetch(`${API_URL}/api/notes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        title: "AI Suggestion",
                        content,
                        tags: ["ai"]
                    })
                });

                if (res.ok) {
                    setToast("Saved as new note!");
                    const newNote = await res.json();
                    onSaveNote?.(newNote); 
                } else {
                    setToast("Failed to save.");
                }

            } else if (note) {
                let updatedContent;
                if (type === "update") updatedContent = content;
                if (type === "add") updatedContent = note.content + "\n" + content;

                res = await fetch(`${API_URL}/api/notes/${note._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: updatedContent })
                });

                if (res.ok) {
                    setToast(type === "update" ? "Note updated!" : "Content added!");
                    const updatedNote = await res.json();
                    onSaveNote?.(updatedNote); 
                } else {
                    setToast("Failed to save note.");
                }
            }

        } catch (err) {
            console.error(err);
            setToast("Error saving note.");
        }

        setTimeout(() => setToast(""), 2000);
    };



    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
                onClick={onClose}
                className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 pointer-events-auto bg-black/30 ${show ? "opacity-100" : "opacity-0"}`}
            ></div>

            <div
                className={`relative z-10 w-[375px] sm:w-[640px] md:w-[960px] lg:w-[90vw] max-w-[1400px] h-[90vh] p-6 rounded-lg transform transition-all duration-300 pointer-events-auto
                    ${theme === "light" ? "bg-white text-gray-900 shadow-lg" : "bg-[#0c0013] text-gray-200 shadow-xl"}
                    ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-300 text-xl font-bold"
                >
                    ✕
                </button>

                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="flex flex-col">
                                <div
                                    className={`p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap
                                        ${msg.role === "user"
                                            ? "bg-pink-500 text-white self-end ml-auto"
                                            : theme === "light"
                                                ? "bg-gray-100 text-gray-900 self-start"
                                                : "bg-gray-800 text-gray-200 self-start"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === "assistant" && (
                                    <div className="mt-1 flex gap-2">
                                        <button
                                            onClick={() => saveAsNote(msg.content, "new")}
                                            className="text-xs text-pink-600 hover:underline"
                                        >
                                            Save as Note
                                        </button>
                                        <button
                                            onClick={() => saveAsNote(msg.content, "update")}
                                            className="text-xs text-pink-600 hover:underline"
                                        >
                                            Update this Note
                                        </button>
                                        <button
                                            onClick={() => saveAsNote(msg.content, "add")}
                                            className="text-xs text-pink-600 hover:underline"
                                        >
                                            Add this Note
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="text-sm text-gray-500">AI is typing…</div>}
                        <div ref={scrollRef} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 w-full">
                        {PROMPTS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(p.text)}
                                disabled={loading}
                                className="px-2 py-1 text-sm bg-pink-100 text-pink-600 rounded hover:bg-pink-200 disabled:opacity-50"
                                title={p.text}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={2}
                            placeholder="Type your message…"
                            className={`flex-1 border rounded p-2 resize-none
                                ${theme === "light"
                                    ? "bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500"
                                    : "bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500 focus:ring-pink-400 focus:border-pink-400"
                                } transition-colors duration-200`}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading}
                            className={`px-3 py-2 rounded hover:opacity-90 disabled:opacity-60 flex items-center gap-1
                                ${theme === "light"
                                    ? "bg-pink-500 text-white hover:bg-pink-600"
                                    : "bg-pink-600 text-white hover:bg-pink-500"
                                } transition-colors duration-200`}
                        >
                            Send
                            <FiSend />
                        </button>
                    </div>

                    {toast && (
                        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-pink-500 text-white rounded shadow-lg transition-all duration-300">
                            {toast}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiChatModal;
