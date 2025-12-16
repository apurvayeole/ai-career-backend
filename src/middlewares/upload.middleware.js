import multer from 'multer'

// Use memory storage so uploaded file.buffer is available directly
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Export the configured multer instance so routes can use `upload.single('file')`
export default upload;