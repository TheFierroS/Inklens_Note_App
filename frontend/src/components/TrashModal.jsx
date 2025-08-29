import React, { useEffect } from "react";
import useTheme from "../context/useTheme";
import Modal from "./Modal";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const TrashModal = ({ deletedNotes, isOpen, onClose, onRestore, onPermanentDelete, refreshNotes }) => {
    const { theme } = useTheme();

    // 30 günden eski notları sadece modal açıldığında sil
    useEffect(() => {
        if (!isOpen || !deletedNotes.length) return;

        const cleanupOldNotes = async () => {
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const oldNotes = deletedNotes.filter(note => new Date(note.deletedAt) < thirtyDaysAgo);

            for (const note of oldNotes) {
                try {
                    // Yeni API endpoint kullan
                    await axios.delete(`${API_URL}?permanent=true&id=${note._id}`);
                    console.log("Old note permanently deleted:", note._id);
                } catch (err) {
                    console.error("Failed to delete old note:", err);
                }
            }

            if (oldNotes.length > 0) {
                refreshNotes && refreshNotes();
            }
        };

        cleanupOldNotes();
    }, [isOpen, deletedNotes, refreshNotes]);

    const handleRestore = async (note) => {
        try {
            console.log("Restoring note from TrashModal:", note._id);
            if (onRestore) {
                await onRestore(note);
            }
        } catch (err) {
            console.error("Failed to restore note:", err);
        }
    };

    const handlePermanentDelete = async (note) => {
        if (!window.confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
            return;
        }

        try {
            console.log("Permanently deleting note:", note._id);
            if (onPermanentDelete) {
                await onPermanentDelete(note._id);
            } else {
                // Fallback: yeni API endpoint kullan
                await axios.delete(`${API_URL}?permanent=true&id=${note._id}`);
                refreshNotes && refreshNotes();
            }
        } catch (err) {
            console.error("Failed to permanently delete note:", err);
        }
    };

    const handleClearTrash = async () => {
        if (!window.confirm("Are you sure you want to permanently delete all notes in trash? This action cannot be undone.")) {
            return;
        }

        try {
            console.log("Clearing all trash");

            if (onPermanentDelete) {
                for (const note of deletedNotes) {
                    await onPermanentDelete(note._id);
                }
            } else {
                // Fallback: yeni API endpoint kullan
                for (const note of deletedNotes) {
                    await axios.delete(`${API_URL}?permanent=true&id=${note._id}`);
                }
                refreshNotes && refreshNotes();
            }
        } catch (err) {
            console.error("Failed to clear trash:", err);
        }
    };

    const formatDeletedDate = (deletedAt) => {
        const date = new Date(deletedAt);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`p-4 ${theme === "light" ? "bg-white text-gray-900" : "bg-[#0c0013ff] text-gray-200"}`}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Trash ({deletedNotes.length})</h2>
                    {deletedNotes.length > 0 && (
                        <button
                            onClick={handleClearTrash}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {deletedNotes.length > 0 && (
                    <p className="text-sm text-gray-400 mb-4">
                        Notes will be permanently deleted after 30 days.
                    </p>
                )}

                {deletedNotes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">🗑️</p>
                        <p className="text-gray-500 mt-2">Trash is empty.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                        {deletedNotes.map(note => (
                            <div key={note._id} className={`p-3 rounded border transition-colors
                                ${theme === "light" ? "border-gray-300 bg-gray-50 hover:bg-gray-100" : "border-gray-700 bg-[#1a001f] hover:bg-[#2a002f]"}`}>

                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1 truncate">{note.title || "Untitled"}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                            {note.content.slice(0, 100)}{note.content.length > 100 ? "..." : ""}
                                        </p>

                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex gap-1 mt-2 flex-wrap">
                                                {note.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="px-2 py-1 text-xs rounded bg-pink-100 text-pink-600">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {note.tags.length > 3 && (
                                                    <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">
                                                        +{note.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-500 mt-2">
                                            Deleted: {formatDeletedDate(note.deletedAt)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleRestore(note)}
                                            className="px-3 py-1 bg-[#ff008d] text-white rounded hover:bg-[#cc0070] text-sm transition-colors"
                                        >
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(note)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TrashModal;