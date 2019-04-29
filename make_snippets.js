'use strict'
const fs = require('fs')
const path = require('path')

let pre = 'i'
let preDes = 'iview'
let scope = 'vue, html, vue-html'

/**
 * 将 HTML 字符串转换为 HTML 字符串数组
 * @param {String} str HTML 字符串
 */
function rawLines(str) {
  return str.match(/[^\r\n]+/g).map(i => i.trimRight())
}

/**
 * 初始 snippet 项参数
 * @param {String} str HTML 字符串
 */
function initSnippetOption(str) {
  return {
    prefix: `${pre}${str.match(/\w+/)[0].toLowerCase()}`,
    scope: scope,
    body: rawLines(str)
  }
}

/**
 * 获取文件
 * @param {String} filePath 文件所在目录路径
 * @param {String} type 文件后缀
 */
function getFiles(dirPah, type) {
  let snippets = {}
  fs.readdirSync(dirPah).forEach(i => {
    const filePath = path.join(dirPah, i)
    const filename = path.basename(filePath, type)

    if (path.extname(i) === type && !fs.statSync(filePath).isDirectory()) {
      const strHtml = fs.readFileSync(filePath, 'utf8')
      if (strHtml) {
        let _snippet = initSnippetOption(strHtml)
        _snippet['description'] = `${preDes} ${filename}`
        snippets[filename] = _snippet
      } else {
        console.log('Failed to read file:', filePath)
      }
    }
  })
  return snippets
}

/**
 * 写入文件
 * @param {String} path 写入文件的路径
 * @param {Object} data snippets 对象
 */
function writeFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

writeFile(
  path.join(__dirname, 'snippets', 'iview.json'),
  getFiles(path.join(__dirname, 'html'), '.html')
)
