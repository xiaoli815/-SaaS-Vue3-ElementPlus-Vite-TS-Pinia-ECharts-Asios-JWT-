import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

/**
 * 读取 JSON 数据文件
 */
export function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

/**
 * 写入 JSON 数据文件
 */
export function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}