// here we are only providing the path to the file uploaded and not storing it temp in the local device and then uploading it into cloudinary that's why we do not have destination public/temp
import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({storage});

export default upload;