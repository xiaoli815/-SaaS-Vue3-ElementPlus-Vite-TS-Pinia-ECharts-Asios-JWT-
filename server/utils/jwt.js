import jwt from 'jsonwebtoken'

// 密钥配置（生产环境请使用更安全的密钥并放入环境变量）
const ACCESS_TOKEN_SECRET = 'saas_access_secret_key_2024'
const REFRESH_TOKEN_SECRET = 'saas_refresh_secret_key_2024'

// Token 有效期
const ACCESS_TOKEN_EXPIRES = '2h'
const REFRESH_TOKEN_EXPIRES = '7d'

/**
 * 生成双 Token
 */
export function generateTokens(payload) {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  })
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  })
  return { accessToken, refreshToken }
}

/**
 * 验证 Access Token
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

/**
 * 验证 Refresh Token
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

/**
 * 从 Token 中解析用户信息（忽略过期，仅用于刷新场景）
 */
export function decodeRefreshToken(token) {
  return jwt.decode(token)
}