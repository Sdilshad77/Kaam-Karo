import "dotenv/config"
import express from "express"
import colors from "colors"
import connectDB from "./config/dbConfig.js"
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Local Imports
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import freelancerRoutes from "./routes/freelancerRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import cors from "cors"


const PORT = process.env.PORT || 8080
const app = express()

// DB CONNECTION
connectDB()

// CORS
app.use(cors({ origin:[["https://kaam-karo-wri3.vercel.app",'http://localhost:5173']], credentials: true }))

// Body-Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))


app.get("/", (req, res) => {
    res.json({
        message: "WELCOME TO KAAM KARO API 1.0"
    })
})


// Auth Routes
app.use("/api/auth", authRoutes)

// Admin Routes
app.use("/api/admin", adminRoutes)

// Freelancer Routes
app.use("/api/freelancer", freelancerRoutes)

// Project Routes
app.use("/api/project", projectRoutes)



// Error Handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black)
})