import dotenv from 'dotenv'
import express from 'express'
import connectDB from './db/db.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import employeeRouter from './routes/employee.routes.js'
const app=express()

//loading enviroment variables
dotenv.config({
    path: './.env'
})


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//setup of user route
app.use('/api/users', userRouter);

//setup of employee routes
app.use('/api/employees',employeeRouter);

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, ()=>{
        console.log(`Server is running on port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB CONNECTION ERROR", err)
})