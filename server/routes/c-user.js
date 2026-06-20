import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fs.js'

const router = Router()

// 登录
router.post('/login', (req, res) => {
  const { userTel, userPwd } = req.body
  if (!userTel || !userPwd) {
    return res.json({ code: 400, data: null, message: '手机号或密码不能为空' })
  }

  const users = readJSON('c-users')
  const user = users.find(u => u.tel === userTel && u.pwd === userPwd)
  if (!user) {
    return res.json({ code: 400, data: null, message: '手机号或密码错误' })
  }

  res.json({ code: 0, data: user, message: '登录成功' })
})

// 注册
router.post('/register', (req, res) => {
  const { phone, pwd } = req.body
  if (!phone || !pwd) {
    return res.json({ code: 400, data: null, message: '手机号或密码不能为空' })
  }

  const users = readJSON('c-users')
  if (users.find(u => u.tel === phone)) {
    return res.json({ code: 400, data: null, message: '用户已存在，请登录' })
  }

  const newUser = {
    id: Date.now() % 1000000000,
    tel: phone,
    pwd: pwd,
    nickName: '用户',
    imgUrl: 'default.png',
    token: String(Date.now())
  }
  users.push(newUser)
  writeJSON('c-users', users)

  res.json({ code: 0, data: newUser, message: '注册成功' })
})

// 修改密码
router.post('/modify', (req, res) => {
  const { phone, pwd } = req.body
  const users = readJSON('c-users')
  const user = users.find(u => u.tel === phone)
  if (!user) return res.json({ code: 404, data: null, message: '用户不存在' })

  user.pwd = pwd
  writeJSON('c-users', users)
  res.json({ code: 0, data: null, message: '修改成功' })
})

export default router