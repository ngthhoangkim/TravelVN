import express from "express";
import userController from "../controller/userController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
router.get(
    "/google-login",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })
  );
  
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/signin",
      session: false,
    }),
    (req, res) => {
      const token = jwt.sign(
        {
          _id: req.user._id,
          isAdmin: req.user.isAdmin,
          username: req.user.username,
          email: req.user.email,
          photos: req.user.photos || [],
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
          __v: req.user.__v,
        },
        process.env.JWT,
        { expiresIn: "1h" }
      );
  
      res.redirect(`http://localhost:3000/signin?token=${token}`);
    }
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    userController.googleCallback
  );
  // Facebook login routes
  router.get("/facebook-login", passport.authenticate("facebook"));
  
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/signin",
      session: false,
    }),
    (req, res) => {
      // Generate JWT token after successful Facebook login
      const token = jwt.sign(
        {
          _id: req.user._id,
          isAdmin: req.user.isAdmin,
          username: req.user.username,
          email: req.user.email,
          photos: req.user.photos || [],
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
          __v: req.user.__v,
        },
        process.env.JWT,
        { expiresIn: "1h" }
      );
  
      // Redirect with token or send token to frontend
      res.redirect(`http://localhost:3000/signin?token=${token}`);
    }
  );
  
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { session: false }),
    userController.facebookCallback
  );
  
router.post("/register", userController.addUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.delete("/:id",userController.deleteUser);

router.put("/:id",userController.updateUser);

router.get("/count", userController.countUser);     
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getIdUser); 
router.get("/check-username", userController.checkUsernameExists);  
router.get("/check-email", userController.checkEmailExists);  
router.get("/forgotPassword", userController.forgotPassword);  

export default router;