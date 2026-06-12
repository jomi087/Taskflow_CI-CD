import express from 'express'
export const app = express()

const tasks = []s

app.use(express.json())

app.get('/health', (req, res) => {

    res.status(200).json({
        success: true,
        msg: "working perfectly v2"
    });
})