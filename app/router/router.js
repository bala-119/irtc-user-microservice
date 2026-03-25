const express = require("express");
const router = express.Router();

const routes = require("../routes/routes");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(routes.v1.user.register, authController.register);
router.get(routes.v1.user.getUserbyId,authController.getUserbyId);
router.post(routes.v1.user.verifyEmailOtp, authController.verifyEmailOtp);

router.post(routes.v1.user.login, authController.login);

// Protected routes
router.post(routes.v1.user.updateMpin, authMiddleware, authController.updateMpin);

router.post(routes.v1.user.updatePassword, authMiddleware, authController.updatePassword);


router.post(routes.v1.user.updateProfile,authMiddleware,authController.updateProfile);
router.post(routes.v1.user.forgotPassword,authController.forgotPassword);

router.post(routes.v1.user.resetPassword,authController.resetPassword);

router.post(routes.v1.user.MpinLogin,authController.MpinLogin);

// still mobileotp login not wwritten
 router.post(routes.v1.user.MobileOtpLogin,authController.MobileOtpLogin);
 router.post(routes.v1.user.emailOtpLogin,authController.emailOtpLogin);
 router.post(routes.v1.user.VerifyMobileOtpLogin,authController.VerifyMobileOtpLogin);
 router.post(routes.v1.user.verifyemailOtpLogin,authController.verifyemailOtpLogin);
 router.patch(routes.v1.user.setAadhaar,authMiddleware,authController.setAadhaar);
//  router.get(routes.v1.user.getUserbyId,authController.getUserById)
router.post(routes.v1.user.verifyEmailOtp_for_true,authController.verifyEmailOtp_for_true);
router.post(routes.v1.user.verifyPhoneOtp_for_true,authController.verifyPhoneOtp_for_true);

module.exports = router;