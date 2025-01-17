const express = require('express')
const port = 8080;
const generatePdf = require('./routes/pdfRoute')

const app = express()

app.use(express.json())


app.use('/api', generatePdf)
app.listen(port, () => (
    console.log(`Server is running on ${port}`)
))