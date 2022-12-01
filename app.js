import express from 'express'
import router from './src/router/index.js'

const app = express()
const port = 3003

router(app, express)

app.listen(port, () => {
    console.log(`ZalApp backend listening on port ${port}`)
})

