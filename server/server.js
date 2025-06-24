import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

//  Connect to DB
await connectDB();

// Raw body for Clerk webhook — must come BEFORE express.json
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }));

//Then setting express.json and cors for other routes
app.use(express.json());
app.use(cors());

//Routes
app.get('/', (req, res) => res.send("API working"));
app.use('/api/user', userRouter);
app.use('/api/image',imageRouter)

// Starting server
app.listen(PORT, () => console.log("Server running on port", PORT));
