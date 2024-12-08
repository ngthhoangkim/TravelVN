import express from "express";
import regionController from "../controller/regionCotroller.js";

const router = express.Router();

//GET
router.get("/",regionController.getAllRegion);
//DELETE
router.delete("/",regionController.deleteRegion);
//UPDATE
router.put("/",regionController.updateRegion);
//CREATE
router.post("/", regionController.addRegion);


export default router;
