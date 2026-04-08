

  // const routes = {
  //   v1: {
  //     admin: {
  //       login: "/v1/admin/login",
  //     },
  //   },
  // };

  const { verifyEmailOtp,login,register,updateMpin,updatePassword,MobileOtpLogin,VerifyMobileOtpLogin,MpinLogin,verifyemailOtpLogin,setAadhaar, getUserbyId,verifyEmailOtp_for_true,verifyPhoneOtp_for_true} = require("../controllers/authController");



  // module.exports = { routes };

 const routes = {
  v1: {
    user: {
      verifyPhoneOtp_for_true: "/v1/user/verifyPhoneOtp_for_true",
      verifyEmailOtp_for_true: "/v1/user/verifyEmailOtp_for_true",
      register: "/v1/user/register",
      verifyEmailOtp: "/v1/user/verify-mail-otp",
      login: "/v1/user/login",
      updateMpin: "/v1/user/update-mpin",
      updatePassword: "/v1/user/update-password",
      updateProfile: "/v1/user/update-profile",
      profile: "/v1/user/profile",
      forgotPassword: "/v1/user/forgot-password", // it will only send otp to email
      resetPassword: "/v1/user/reset-password",
      MpinLogin: "/v1/user/mpin-login",
      emailOtpLogin: "/v1/user/email-otp-login",
      MobileOtpLogin: "/v1/user/mobile-otp-login",
      verifyemailOtpLogin: "/v1/user/verify-email-otp-login",
      VerifyMobileOtpLogin: "/v1/user/verify-mobile-otp-login",
      setAadhaar: "/v1/user/set-aadhaar",
      getUserbyId: "/v1/user/get-user/:id"  // This will correctly handle the :id parameter
    }
  }
};

module.exports = routes;




