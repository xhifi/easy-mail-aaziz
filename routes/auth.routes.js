const router = require("express").Router();
const {
  login,
  signup,
  refreshEmailVerificationCode,
  forgotPassword,
  confirmEmail,
  refreshAccessToken,
  logout,
} = require("../controllers/auth");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/refresh-access-token").get(refreshAccessToken);
router.route("/refresh-email-verification").get(refreshEmailVerificationCode);
router.route("/forgot-password").post(forgotPassword);
router.route("/confirm-email/:code").get(confirmEmail);
router.route("/logout").post(logout);

module.exports = router;
