import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js";
import imageRouter from "./routes/images.js";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/api/notes", notesRouter);
app.use("/api/images", imageRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));