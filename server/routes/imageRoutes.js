import express from 'express';
import { removeBgImage } from '../controllers/imageController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/auth.js';

const imageRouter = express.Router()

// adding 2 middlewares 1.upload i.e multer middleware to parse the formdata 2.user authentication
imageRouter.post('/remove-bg',upload.single('image'),authUser,removeBgImage)

export default imageRouter
