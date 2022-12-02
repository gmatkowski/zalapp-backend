import express, { Express } from 'express'
import dotenv from 'dotenv'
import router from './src/router/index.js'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3003

app.use(express.json())

router(app)

app.listen(port, () => {
    console.log(`⚡️Zalapp at https://localhost:${port}`)
})
