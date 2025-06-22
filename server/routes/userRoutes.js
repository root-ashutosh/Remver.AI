import express from 'express';
import { clerkWebhooks } from '../controllers/userController.js';

const userRouter = express.Router();

// ✅ Handles: POST /api/user/webhooks
userRouter.post('/webhooks', clerkWebhooks);

export default userRouter;
