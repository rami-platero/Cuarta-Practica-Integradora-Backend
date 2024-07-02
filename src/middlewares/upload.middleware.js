import multer from "multer";
import __dirname from '../utils.js'

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    let destinationFolder = "";
    if (req.originalUrl.includes("documents")) {
      destinationFolder = "/documents";
    }
    if (req.originalUrl.includes("profile-picture")) {
      destinationFolder = "/profiles";
    }
    if (req.originalUrl.includes("products")) {
      destinationFolder = "/products";
    }

    cb(null, `${__dirname}/public/uploads${destinationFolder}`);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

export const upload = multer({ storage });
