// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure uploads folder exists
// const uploadPath = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath); // use the ensured folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // File filter (only png or gif)
// function fileFilter(req, file, cb) {
//   const fileTypes = /png|gif/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   if (extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .png or .gif files are allowed"));
//   }
// }

// export const upload = multer({ storage, fileFilter });
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Multer storage config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bugtracker", // folder in Cloudinary
    format: async (req, file) => "png", // optional: keep original or convert
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// File filter (only png or gif)
const fileFilter = (req, file, cb) => {
  const fileTypes = /png|gif/;
  const extname = fileTypes.test(file.originalname.toLowerCase());
  if (extname) cb(null, true);
  else cb(new Error("Only .png or .gif files are allowed"));
};

export const upload = multer({ storage, fileFilter });
