const multer = require('multer')
const path = require('path')

const uploadImages = (subDir = '', allowVideos = false) => {
  const fileFilter = (req, file, cb) => {
    const allowedTypes =
      allowVideos == true ? /jpeg|jpg|png|gif|ico|mp4/ : /jpeg|jpg|png|gif|ico/
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.test(ext)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          allowVideos == true
            ? 'Only image files and mp4 videos are allowed!'
            : 'Only image files are allowed!',
        ),
      )
    }
  }

  const uploadDir = path.join(__dirname, `../../images/${subDir}`)

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    },
  })

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: process.env.MAX_FILE_SIZE * 1024 * 1024 },
  })
}

module.exports = { uploadImages }
