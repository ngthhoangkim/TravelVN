import express from "express";
import imageController from "../controller/imageCotroller.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

//ADD
router.post("/upload",upload.single('image'),imageController.addIMG);
//GET
router.get("/:id",imageController.getIMG);
//DELETE
router.delete('/:id', imageController.deleteIMG);
//UPDATE
router.put("/:id",upload.single('image'),imageController.updateIMG);

export default router;
