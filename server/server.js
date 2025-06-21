import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'

// APP config
const PORT = process.env.PORT || 4000
const app = express() //initialising instance of express
await connectDB()

// API routes
app.get('/',(req,res)=> res.send("Api working"))

app.use('/api/user',userRouter) 


// initialize middleware
app.use(express.json()) 
app.use(cors()) 

app.listen(PORT, ()=> console.log('Server running on PORT:' +PORT))

