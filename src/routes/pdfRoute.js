const express = require('express')
const { createPdf } = require('../controller/generatePdfController')


const router = express.Router()

router.post('/generate-pdf', createPdf)

module.exports = router