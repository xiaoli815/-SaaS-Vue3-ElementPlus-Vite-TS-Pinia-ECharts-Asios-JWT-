import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../public/product/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log('📁 已创建上传目录:', uploadDir)
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, 'upload-' + uniqueSuffix + ext)
  },
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支持图片文件 (jpeg, png, gif, webp)'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 最大 2MB
  },
})

// 上传接口
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({
      code: 400,
      data: null,
      message: '请选择要上传的文件',
    })
  }

  // 返回可访问的 URL
  const fileUrl = `/product/uploads/${req.file.filename}`

  res.json({
    code: 200,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
    message: '上传成功',
  })
})

// 错误处理
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.json({
        code: 400,
        data: null,
        message: '文件大小不能超过 2MB',
      })
    }
    return res.json({
      code: 400,
      data: null,
      message: err.message,
    })
  }
  if (err) {
    return res.json({
      code: 400,
      data: null,
      message: err.message,
    })
  }
  next()
})

export default router