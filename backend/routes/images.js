
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";


const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
        }
    }
});


router.post("/upload", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Resim dosyası bulunamadı' });
        }

       
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
            {
                folder: 'inklens-notes', 
                transformation: [
                    { width: 800, height: 600, crop: 'limit' }, 
                    { quality: 'auto' } 
                ]
            }
        );

        res.json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Resim yükleme hatası: ' + error.message });
    }
});


router.delete("/:publicId", async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.json({ message: 'Resim başarıyla silindi' });
        } else {
            res.status(404).json({ error: 'Resim bulunamadı' });
        }
    } catch (error) {
        console.error('Image delete error:', error);
        res.status(500).json({ error: 'Resim silme hatası: ' + error.message });
    }
});

export default router;
