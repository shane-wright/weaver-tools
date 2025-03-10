import cors from "cors"
import express from "express"
import appRoutes from "./routes.js"

const app = express()

const corsOptions = {
    origin: "http://localhost:5173"
}

app.use(cors(corsOptions))

app.use(express.json())

app.use("/", appRoutes)

export default app
