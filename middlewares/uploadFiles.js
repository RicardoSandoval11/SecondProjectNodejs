import multer from "multer";
import path from 'path';
import shortid from "shortid";

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        // la siguiente linea se ejecuta si el archivo fue subido correctamente
        callback(null ,'./public/uploads/');
    },
    filename: function(request, file, callback){
        callback(null, shortid.generate() + path.extname(file.originalname));
    }
});

// sirve para quese usen las configuraciones que se acaban de realizar
const upload = multer({ storage });

export default upload;