// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import connectDB from './config/mongodb.js'
// import userRouter from './routes/userRoutes.js'

// // APP config
// const PORT = process.env.PORT || 4000
// const app = express() //initialising instance of express
// await connectDB()

// // API routes
// app.get('/',(req,res)=> res.send("Api working"))

// app.use('/api/user',userRouter)


// // initialize middleware
// app.use(express.json()) 
// app.use(cors()) 

// app.listen(PORT, ()=> console.log('Server running on PORT:' +PORT))

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ 1. Connect to DB
await connectDB();

// ✅ 2. Raw body for Clerk webhook — must come BEFORE express.json
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }));

// ✅ 3. Then setup express.json and cors for other routes
app.use(express.json());
app.use(cors());

// ✅ 4. Routes
app.get('/', (req, res) => res.send("API working"));
app.use('/api/user', userRouter);

// ✅ 5. Start server
app.listen(PORT, () => console.log("Server running on port", PORT));
