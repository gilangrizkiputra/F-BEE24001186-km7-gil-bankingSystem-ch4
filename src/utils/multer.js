import multer from "multer";
import path from "path";

const fileName = (req, file, callback) => {
  const filename = Date.now() + path.extname(file.originalname);
  callback(null, filename);
};

// const generateStorage = (destination) => {
//   return multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, destination);
//     },
//     filename: fileName,
//   });
// };

const fileFilter = (req, file, callback) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedFileTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    const error = new Error(
      "Only ${allowedFileTypes.join(",
      ")} are allowed to upload"
    );
    callback(error, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});


export { upload };
