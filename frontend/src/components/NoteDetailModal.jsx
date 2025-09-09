import React, { useState } from "react";
import Modal from "./Modal";
import useTheme from "../context/useTheme";
import AiChatModal from "./AiChatModal";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { RiRobotLine } from "react-icons/ri";

const NoteDetailModal = ({ note, isOpen, onClose, refreshNotes }) => {
    const { theme } = useTheme();
    const [showToast, setShowToast] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

    const { user } = useKindeAuth();
    const userId = user?.id;

    if (!note) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(note.content);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const parseContentWithImages = (content) => {
        if (!content) return <p></p>;

        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(content)) !== null) {
            if (match.index > lastIndex) {
                elements.push(
                    <span key={`text-${lastIndex}`}>
                        {content.substring(lastIndex, match.index)}
                    </span>
                );
            }

            const altText = match[1];
            const imageUrl = match[2];
            elements.push(
                <img
                    key={`img-${match.index}`}
                    src={imageUrl}
                    alt={altText || "Note image"}
                    className="max-w-full h-auto rounded my-2 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ maxHeight: "300px" }}
                    onClick={(e) => { e.stopPropagation(); window.open(imageUrl, "_blank"); }}
                />
            );

            lastIndex = imageRegex.lastIndex;
        }

        if (lastIndex < content.length) {
            elements.push(
                <span key={`text-${lastIndex}`}>
                    {content.substring(lastIndex)}
                </span>
            );
        }

        return (
            <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {elements}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4 max-h-[80vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-3 break-words">{note.title}</h2>

                <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 mb-4">
                    <div className={`whitespace-pre-wrap break-words ${theme === "light" ? "text-gray-700" : "text-gray-200"}`}>
                        {parseContentWithImages(note.content)}
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mt-2 mb-2">
                    {note.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-pink-100 text-pink-600 break-words">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1 bg-[#ff008d] text-white rounded hover:bg-[#cc0070] w-auto self-start flex items-center gap-1"
                    >
                        Copy
                    </button>

                    <button
                        onClick={() => setIsAiOpen(true)}
                        className="ml-auto px-3 py-1 bg-[#ff008d] text-white rounded hover:bg-[#cc0070] w-auto flex items-center gap-1"
                    >
                        <RiRobotLine size={18} />
                        Ask AI Assistant
                    </button>
                </div>

                <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[#ff008d] text-white rounded shadow-lg transition-all duration-300 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    Note copied!
                </div>

                <AiChatModal
                    isOpen={isAiOpen}
                    onClose={() => setIsAiOpen(false)}
                    note={note}
                    userId={userId}
                    onSaveNote={refreshNotes} 
                />
            </div>
        </Modal>
    );
};

export default NoteDetailModal;
