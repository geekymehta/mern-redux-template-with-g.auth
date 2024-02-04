const express = require("express");
const passport = require("passport");
const { protect } = require("../middleware/authMiddleware");
const {
  googleAuthModule,
  // facebookAuthModule,
} = require("./../controllers/googleAuthController");

const {
  loginUser,
  registerUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

//local auth routes
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/user").get(protect, getUserInfo);

//google auth routes
router.route("/google/login").get(googleAuthModule.googleLoginAuth);
router
  .route("/google/login/callback")
  .get(
    googleAuthModule.googleCallbackAuth,
    googleAuthModule.googleCallbackLoggedIn
  );
router.route("/google/logout").get(googleAuthModule.googleLogout);

// //facebook auth routes
// router.route("/facebook/login").get(facebookAuthModule.facebookAuthModule);
// router
//   .route("/facebook/login/callback")
//   .get(
//     facebookAuthModule.facebookCallbackAuth,
//     facebookAuthModule.facebookCallbackLoggedIn
//   );

module.exports = router;
