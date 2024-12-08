import express from "express";
import FavoriteController from "../controller/favoriteController.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", FavoriteController.getFavorites);
router.post("/",FavoriteController.addFavorite);
router.delete("/",FavoriteController.removeFavorite);

export default router;
