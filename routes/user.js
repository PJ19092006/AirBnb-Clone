const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  //render signup form
  .get(userController.renderSignupForm)
  //signing the user in
  .post(wrapasync(userController.signUp));

router
  .route("/login")
  // login form render
  .get(userController.renderLoginForm)
  //loging in the user
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: `/login`,
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
