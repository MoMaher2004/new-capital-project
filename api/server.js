const os = require('os')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, 'config.env') })
const express = require('express')
const userRoute = require('./routes/userRoute')
const reviewRoute = require('./routes/reviewRoute')
const slideRoute = require('./routes/slideRoute')
const memberRoute = require('./routes/memberRoute')
const messageRoute = require('./routes/messageRoute')
const categoryRoute = require('./routes/categoryRoute')
const subCategoryRoute = require('./routes/subCategoryRoute')
const projectRoute = require('./routes/projectRoute')
const cors = require('cors')
const fs = require('fs')

const logFile = path.join(__dirname, 'error.log')

const originalError = console.error

console.error = function (...args) {
  const message = args
    .map(a => (typeof a === 'object' ? JSON.stringify(a) : a))
    .join(' ')

  const logMessage = `[${new Date().toISOString()}] ${message}\n`

  fs.appendFileSync(logFile, logMessage)

  originalError.apply(console, args)
}

const app = express()

const uploadDir = path.join(__dirname, '../images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}
if (!fs.existsSync(path.join(uploadDir, 'reviews'))) {
  fs.mkdirSync(path.join(uploadDir, 'reviews'))
}
if (!fs.existsSync(path.join(uploadDir, 'slides'))) {
  fs.mkdirSync(path.join(uploadDir, 'slides'))
}
if (!fs.existsSync(path.join(uploadDir, 'members'))) {
  fs.mkdirSync(path.join(uploadDir, 'members'))
}
if (!fs.existsSync(path.join(uploadDir, 'projects'))) {
  fs.mkdirSync(path.join(uploadDir, 'projects'))
}


// app.use(cors({
//   origin: [""],
//   methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }))

app.use(express.json())
app.use('../images', express.static('images'))
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoute)
app.use('/api/review', reviewRoute)
app.use('/api/slide', slideRoute)
app.use('/api/member', memberRoute)
app.use('/api/message', messageRoute)
app.use('/api/category', categoryRoute)
app.use('/api/subCategory', subCategoryRoute)
app.use('/api/project', projectRoute)
app.use('/health', (req, res) => {
  return res.status(200).json({ msg: 'hi! server is working' })
})

const port = process.env.PORT || 3000

const interfaces = os.networkInterfaces()
var address
for (const name in interfaces) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      address = iface.address
      break
    }
  }
}
app.listen(port, () => {
  console.log(`server started at: http://${address}:${port}`)
})