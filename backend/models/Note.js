import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    images: [{
        url: String,
        publicId: String, 
        position: Number 
    }],
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
