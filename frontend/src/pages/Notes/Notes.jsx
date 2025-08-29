import React, { useState, useEffect, useCallback } from "react";
import NotesHeader from "../../components/NotesHeader";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import LoginPrompt from "../../components/LoginPrompt";
import SearchBar from "../../components/SearchBar";
import ViewToggle from "../../components/ViewToggle";
import TagsSidebar from "../../components/TagsSidebar";
import Modal from "../../components/Modal";
import NewNoteButton from "../../components/NewNoteButton";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FaTrashAlt, FaThumbtack, FaImage } from "react-icons/fa";
import TrashModal from "../../components/TrashModal";
import TrashButton from "../../components/TrashButton";
import useTheme from '../../context/useTheme';
import NoteDetailModal from "../../components/NoteDetailModal";
import axios from "axios";

const API_URL = "import.meta.env.VITE_API_URL || http://localhost:5000/api/notes";
const IMAGE_API_URL = "import.meta.env.VITE_IMAGE_API_URL || http://localhost:5000/api/images";

const Notes = () => {
    const { user, isLoading } = useKindeAuth();
    const { theme } = useTheme();

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [notes, setNotes] = useState([]);
    const [deletedNotes, setDeletedNotes] = useState([]);

    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newTags, setNewTags] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const [editUploadingImage, setEditUploadingImage] = useState(false);

    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

    
    const handleImageUpload = async (file, isEdit = false) => {
        if (isEdit) {
            setEditUploadingImage(true);
        } else {
            setUploadingImage(true);
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${IMAGE_API_URL}/upload`, formData);
            const imageData = response.data;

            
            const imageMarkdown = `\n![image](${imageData.url})\n`;

            if (isEdit) {
                setEditNote(prev => ({
                    ...prev,
                    content: prev.content + imageMarkdown
                }));
            } else {
                setNewContent(prev => prev + imageMarkdown);
            }

        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Resim yükleme başarısız oldu. Lütfen tekrar deneyin.');
        } finally {
            if (isEdit) {
                setEditUploadingImage(false);
            } else {
                setUploadingImage(false);
            }
        }
    };

    
    const parseContentForGrid = (content) => {
        if (!content) return "";

        
        const textOnly = content.replace(/!\[.*?\]\(.*?\)/g, '');

        
        return textOnly.length > 80 ? textOnly.substring(0, 80) + '...' : textOnly;
    };

    
    const renderNewContentWithImages = (content) => {
        if (!content) return <p className={`${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>Content will appear here...</p>;

        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(content)) !== null) {
            if (match.index > lastIndex) {
                elements.push(
                    <span
                        key={`text-${lastIndex}`}
                        className={`whitespace-pre-wrap ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}
                    >
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
                    className="max-w-full h-auto rounded my-2 max-h-32 object-contain"
                />
            );

            lastIndex = imageRegex.lastIndex;
        }

        if (lastIndex < content.length) {
            elements.push(
                <span
                    key={`text-${lastIndex}`}
                    className={`whitespace-pre-wrap ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}
                >
                    {content.substring(lastIndex)}
                </span>
            );
        }

        return <div className={`min-h-32 ${theme === "light" ? "bg-white" : "bg-[#1a001f]"}`}>{elements}</div>;
    };

    
    const fetchNotes = useCallback(async () => {
        if (!user?.id) {
            console.log("No user ID available");
            return;
        }

        try {
            console.log("Fetching notes for user:", user.id);
            const res = await axios.get(`${API_URL}?userId=${user.id}`);

            console.log("API Response:", res.data);
            console.log("Active notes:", res.data.activeNotes);
            console.log("Deleted notes:", res.data.deletedNotes);

            setNotes(res.data.activeNotes || []);
            setDeletedNotes(res.data.deletedNotes || []);
        } catch (err) {
            console.error("Fetch notes failed:", err);
            setNotes([]);
            setDeletedNotes([]);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user || isLoading) return;
        fetchNotes();
    }, [user, isLoading, fetchNotes]);

    if (isLoading) return <p>Loading user...</p>;
    if (!user) return <LoginPrompt />;

    const filteredNotes = notes.filter(note => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const pinnedNotes = filteredNotes.filter(note => note.pinned);
    const otherNotes = filteredNotes.filter(note => !note.pinned);

    const handleSaveNewNote = async () => {
        if (!newTitle.trim() && !newContent.trim()) return;
        if (!user?.id) return;

        const note = {
            userId: user.id,
            title: newTitle,
            content: newContent,
            tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
            pinned: false,
        };

        try {
            console.log("Creating new note:", note);
            await axios.post(API_URL, note);
            await fetchNotes();
            setNewTitle("");
            setNewContent("");
            setNewTags("");
            setIsNewModalOpen(false);
        } catch (err) {
            console.error("Create note failed:", err);
        }
    };

    const openEditModal = note => {
        setEditNote(note);
        setIsEditModalOpen(true);
    };

    const handleUpdateNote = async () => {
        if (!editNote) return;
        try {
            console.log("Updating note:", editNote._id, editNote);
            await axios.put(`${API_URL}/${editNote._id}`, editNote);
            await fetchNotes();
            setEditNote(null);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Update note failed:", err);
        }
    };

    const handleDeleteNote = async note => {
        try {
            console.log("Deleting note:", note._id);
            const response = await axios.delete(`${API_URL}/${note._id}`);
            console.log("Delete response:", response.data);
            await fetchNotes();
        } catch (err) {
            console.error("Delete note failed:", err);
        }
    };

    const handleRestoreNote = async note => {
        try {
            console.log("Restoring note:", note._id);
            const response = await axios.put(`${API_URL}/${note._id}`, { deletedAt: null });
            console.log("Restore response:", response.data);
            await fetchNotes();
        } catch (err) {
            console.error("Restore note failed:", err);
        }
    };

    const handleTogglePin = async note => {
        try {
            console.log("Toggling pin for note:", note._id, "current pinned:", note.pinned);
            await axios.put(`${API_URL}/${note._id}`, { pinned: !note.pinned });
            await fetchNotes();
        } catch (err) {
            console.error("Toggle pin failed:", err);
        }
    };

    const handlePermanentDelete = async (noteId) => {
        try {
            console.log("🔨 Permanent delete attempt for:", noteId);
            console.log("🌐 Request URL:", `${API_URL}?permanent=true&id=${noteId}`);

            const response = await axios.delete(`${API_URL}?permanent=true&id=${noteId}`);
            console.log("✅ Delete successful:", response.data);

            await fetchNotes();
        } catch (err) {
            console.error("❌ Permanent delete failed:", err);
            console.error("📋 Error details:", err.response?.data);
        }
    };

    const renderNotes = notesToRender => (
        <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
            : "flex flex-col gap-4 mb-10"
        }>
            {notesToRender.map(note => (
                <div
                    key={note._id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 relative
                    flex flex-col justify-between cursor-pointer
                    ${theme === "light" ? "bg-gray-100" : "bg-[#1a001f]"}
                    ${note.pinned ? "border-2 border-[#ff008d]" : "border border-gray-300"}
                    ${viewMode === "grid" ? "min-h-[180px] max-h-[220px] h-full" : "flex-row items-center h-25"}`}>

                    <div className="absolute top-3 right-3 flex gap-2 z-10" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleTogglePin(note)}>
                            <FaThumbtack className={`cursor-pointer transition-colors duration-300 ${note.pinned ? "text-pink-600" : "text-gray-500 hover:text-pink-600"}`} />
                        </button>
                        <button onClick={() => openEditModal(note)} className="duration-300 text-gray-500 hover:text-gray-700">
                            <HiOutlinePencilAlt />
                        </button>
                        <button onClick={() => handleDeleteNote(note)} className="duration-300 text-gray-500 hover:text-red-700">
                            <FaTrashAlt />
                        </button>
                    </div>

                    <div className={`${viewMode === "list" ? "flex-grow pr-12" : "pr-12"} overflow-hidden`}>
                        <h2 className="font-bold text-lg line-clamp-2 pr-20">{note.title}</h2>
                        <div className={`text-sm line-clamp-3 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                            {parseContentForGrid(note.content)}
                        </div>
                    </div>

                    <div className={`flex gap-2 mt-2 flex-wrap ${viewMode === "list" ? "ml-4 flex-shrink-0" : ""}`}>
                        {note.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs rounded bg-pink-100 text-pink-600">#{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    return (
        <div className="min-h-screen relative" style={{ fontFamily: 'Raleway, sans-serif' }}>
            <NotesHeader />

            <div className="p-4">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                    <div className="flex justify-center md:justify-start w-full md:w-auto">
                        <TagsSidebar tags={allTags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
                    </div>
                    <div className="hidden md:flex justify-end w-full md:w-auto">
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    </div>
                </div>

                {pinnedNotes.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Pinned Notes</h3>
                        {renderNotes(pinnedNotes)}
                    </div>
                )}

                {otherNotes.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{pinnedNotes.length > 0 ? "Other Notes" : "All Notes"}</h3>
                        {renderNotes(otherNotes)}
                    </div>
                )}

                {filteredNotes.length === 0 && <p className="text-center text-gray-500 mt-6">No notes found.</p>}
            </div>

            <NewNoteButton onClick={() => setIsNewModalOpen(true)} />
            <TrashButton onClick={() => setIsTrashModalOpen(true)} count={deletedNotes.length} />

            
            <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">New Note</h2>

                <input
                    type="text"
                    placeholder="Title"
                    className="w-full mb-2 p-2 border rounded"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                />

                
                <div className="flex flex-col md:flex-row md:gap-4 mb-2">
                    
                    <textarea
                        placeholder="Content (you can use Markdown formatting)"
                        className="md:w-[48%] w-full p-2 border rounded h-36 md:h-60 resize-none"
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                    />

                    
                    <div
                        className={`md:w-[48%] w-full mb-2 md:mb-0 p-2 border rounded h-36 md:h-60 overflow-y-auto 
                        ${theme === "light" ? "bg-white text-gray-800" : "bg-[#1a001f] text-gray-200"}`}
                    >
                        {renderNewContentWithImages(newContent)}
                    </div>
                </div>

                
                <div className="mb-2 flex gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], false)}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`px-3 py-1 bg-[#ff008d] text-white rounded cursor-pointer hover:bg-[#cc0070] flex items-center gap-2 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <FaImage />
                        {uploadingImage ? 'Uploading...' : 'Add Image'}
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    className="w-full mb-4 p-2 border rounded"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                />

                <button
                    className="px-4 py-2 bg-[#ff008d] text-white rounded hover:bg-[#cc0070]"
                    onClick={handleSaveNewNote}
                >
                    Save
                </button>
            </Modal>

            
            {editNote && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">Edit Note</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full mb-2 p-2 border rounded"
                        value={editNote.title}
                        onChange={e => setEditNote({ ...editNote, title: e.target.value })}
                    />

                    
                    <div className="flex flex-col md:flex-row md:gap-4 mb-2">
                        
                        <textarea
                            placeholder="Content (you can use Markdown formatting)"
                            className="md:w-[48%] w-full p-2 border rounded h-36 md:h-60 resize-none"
                            value={editNote.content}
                            onChange={e => setEditNote({ ...editNote, content: e.target.value })}
                        />
                        
                        
                        <div
                            className={`md:w-[48%] w-full mb-2 md:mb-0 p-2 border rounded h-36 md:h-60 overflow-y-auto 
                            ${theme === "light" ? "bg-white text-gray-800" : "bg-[#1a001f] text-gray-200"}`}
                        >
                            {renderNewContentWithImages(editNote.content)}
                        </div>

                    </div>

                    
                    <div className="mb-2 flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                            className="hidden"
                            id="edit-image-upload"
                        />
                        <label
                            htmlFor="edit-image-upload"
                            className={`px-3 py-1 bg-[#ff008d] text-white rounded cursor-pointer hover:bg-[#cc0070] flex items-center gap-2 ${editUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaImage />
                            {editUploadingImage ? 'Uploading...' : 'Add Image'}
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        className="w-full mb-4 p-2 border rounded"
                        value={editNote.tags.join(", ")}
                        onChange={e => setEditNote({ ...editNote, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    />
                    <button
                        className="px-4 py-2 bg-[#ff008d] text-white rounded hover:bg-[#cc0070]"
                        onClick={handleUpdateNote}
                    >
                        Update
                    </button>
                </Modal>
            )}

            <TrashModal
                deletedNotes={deletedNotes}
                isOpen={isTrashModalOpen}
                onClose={() => setIsTrashModalOpen(false)}
                onRestore={handleRestoreNote}
                onPermanentDelete={handlePermanentDelete}
                refreshNotes={fetchNotes}
            />

            <NoteDetailModal
                note={selectedNote}
                isOpen={!!selectedNote}
                onClose={() => setSelectedNote(null)}
            />
        </div>
    );
};

export default Notes;
