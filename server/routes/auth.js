import { Router } from 'express'
import { readJSON } from '../utils/fs.js'
import { generateTokens, verifyRefreshToken, decodeRefreshToken } from '../utils/jwt.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/**
 * POST /api/auth/login
 * 登录接口 —— 验证用户名密码，返回双 Token
 * Body: { username, password }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ code: 400, data: null, message: '用户名和密码不能为空' })
  }

  const users = readJSON('users')
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return res.json({ code: 401, data: null, message: '用户名或密码错误' })
  }

  if (user.status !== 1) {
    return res.json({ code: 403, data: null, message: '账号已被禁用，请联系管理员' })
  }

  // 生成双 Token
  const tokens = generateTokens({
    userId: user.id,
    username: user.username,
    role: user.role,
  })

  return res.json({
    code: 200,
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    message: '登录成功',
  })
})

/**
 * POST /api/auth/refresh
 * 刷新 Token —— 使用 refreshToken 换取新的双 Token
 * Body: { refreshToken }
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.json({ code: 400, data: null, message: 'refreshToken 不能为空' })
  }

  try {
    verifyRefreshToken(refreshToken)
    const decoded = decodeRefreshToken(refreshToken)

    // 从数据库确认用户仍有效
    const users = readJSON('users')
    const user = users.find((u) => u.id === decoded.userId)
    if (!user || user.status !== 1) {
      return res.json({ code: 401, data: null, message: '用户不存在或已禁用' })
    }

    const tokens = generateTokens({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    return res.json({
      code: 200,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      message: 'Token 刷新成功',
    })
  } catch (err) {
    return res.json({ code: 401, data: null, message: 'refreshToken 无效或已过期，请重新登录' })
  }
})

/**
 * GET /api/auth/userinfo
 * 获取当前用户信息（需登录）
 */
router.get('/userinfo', authMiddleware, (req, res) => {
  // 脱敏返回，不暴露密码
  const { password, ...safeUser } = req.user
  return res.json({
    code: 200,
    data: safeUser,
    message: 'ok',
  })
})

/**
 * GET /api/auth/permissions
 * 获取当前用户权限列表
 */
router.get('/permissions', authMiddleware, (req, res) => {
  return res.json({
    code: 200,
    data: {
      role: req.user.role,
      permissions: req.user.permissions,
    },
    message: 'ok',
  })
})

/**
 * POST /api/auth/logout
 * 退出登录
 */
router.post('/logout', (req, res) => {
  // 在实际项目中，这里会清除 refreshToken（如从数据库中删除）
  // 当前为演示版本，直接返回成功（不需要认证）
  return res.json({
    code: 200,
    data: null,
    message: '退出成功',
  })
})

export default router