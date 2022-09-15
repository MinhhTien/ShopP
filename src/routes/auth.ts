import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';

const router = Router();
//Login route
router.post('/login', AuthMiddleware.loginWithEmail);

//Change my password
router.post('/change-password', [AuthMiddleware.checkJwt], AuthMiddleware.changePassword);

//Forgot password route
router.post('/forgot-password', AuthMiddleware.forgotPassword);

//Reset password route
router.post('/reset-password', AuthMiddleware.resetPassword);

//Verify OTP route
router.post('/verify-otp', AuthMiddleware.verifyForgotPassword);

export default router;
