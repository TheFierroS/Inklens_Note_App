
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();
const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { messages = [], note } = req.body;

        let shortenedNote = note || "";
        let noteMsg = null;
        if (shortenedNote.length > 15000) {
            shortenedNote = shortenedNote.slice(0, 15000);
            noteMsg = {
                role: "system",
                content: `The note content was too long and has been truncated:\n${shortenedNote}`
            };
        } else if (shortenedNote) {
            noteMsg = { role: "system", content: `Note content:\n${shortenedNote}` };
        }

        const systemMsg = {
            role: "system",
            content: "You are an assistant inside a note-taking app. Keep answers short and clear."
        };

        const payloadMessages = [systemMsg, noteMsg, ...messages].filter(Boolean);

        const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: payloadMessages,
                temperature: 0.7,
                max_tokens: 700,
                top_p: 1
            })
        });

        const data = await response.json();

        const reply = data.choices?.[0]?.message?.content?.trim() || "No reply received.";
        return res.json({ reply });

    } catch (err) {
        console.error("AI /chat error:", err);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
});

export default router;
