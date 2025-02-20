import express from "express"
import appRoutes from "./routes.js"

const app = express()

app.use(express.json())
app.use("/", appRoutes)

export default app

