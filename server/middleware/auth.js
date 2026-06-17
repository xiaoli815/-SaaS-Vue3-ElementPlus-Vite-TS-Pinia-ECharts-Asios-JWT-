import { verifyAccessToken } from '../utils/jwt.js'
import { readJSON } from '../utils/fs.js'

/**
 * JWT 鉴权中间件 —— 验证 accessToken，将用户信息挂载到 req.user
 */
export function authMiddleware(req, res, next) {
  // 从请求头获取 token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, data: null, message: '未登录或 Token 已失效' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyAccessToken(token)
    // 从数据库（JSON 文件）查找最新用户信息
    const users = readJSON('users')
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({ code: 401, data: null, message: '用户不存在' })
    }
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, data: null, message: 'Token 已过期，请刷新' })
    }
    return res.status(401).json({ code: 401, data: null, message: '非法 Token' })
  }
}