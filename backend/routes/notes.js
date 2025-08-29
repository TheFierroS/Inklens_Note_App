import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// Get all notes for a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    try {
        const notes = await Note.find({ userId });
        const activeNotes = notes.filter(note => !note.deletedAt);
        const deletedNotes = notes.filter(note => note.deletedAt);
        res.json({ activeNotes, deletedNotes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create note
router.post("/", async (req, res) => {
    const { userId, title, content, tags } = req.body;
    try {
        const newNote = await Note.create({ userId, title, content, tags });
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update note
router.put("/:id", async (req, res) => {
    try {
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SOFT DELETE - URL parametresi ile: DELETE /api/notes/123
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    

    try {
        const deleted = await Note.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        if (!deleted) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(deleted);
    } catch (err) {
        console.error("Soft delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// PERMANENT DELETE - Query parametresi ile: DELETE /api/notes?permanent=true&id=123
router.delete("/", async (req, res) => {
    const { permanent, id } = req.query;

    

    if (!id) {
        return res.status(400).json({ error: "id parameter is required" });
    }

    if (permanent !== "true") {
        return res.status(400).json({ error: "permanent=true parameter required" });
    }

    try {
        const deleted = await Note.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json({ message: "Note permanently deleted", note: deleted });
    } catch (err) {
        console.error("Permanent delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;