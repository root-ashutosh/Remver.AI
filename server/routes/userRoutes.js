import express from 'express';
import { clerkWebhooks, paymentRazorpay, userCredit, verifyPayment } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();


userRouter.post('/webhooks', clerkWebhooks);
userRouter.get('/credits',authUser, userCredit);
userRouter.post('/pay-razor',authUser, paymentRazorpay);
userRouter.post('/verify-razor', verifyPayment);


export default userRouter;
