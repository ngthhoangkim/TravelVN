import express from "express";
import postController from "../controller/postController.js";


const router = express.Router();

//GET ALL
router.get("/all",postController.showPost);
//GET THEO ID USER
router.get("/showByUser",postController.showPostById);
//GET THEO ID BÀI VIẾT
router.get("/:id",postController.showPostByPostId);
//DELETE
router.delete("/delete/:id",postController.deletePost);
//UPDATE

//CREATE
router.post("/create",postController.createPost);
//create review
router.post("/reviews/:id", postController.createReview);
//get review
router.get("/review/all/:id", postController.getReviewsById);


export default router;
