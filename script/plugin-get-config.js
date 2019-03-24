const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const ejs = require('ejs')
const getAllPlugin = require('./lib/plugin-get-all')

// eslint-disable-next-line
console.log(chalk.green('开始自动构建插件配置...'));

const targetDir = path.resolve(__dirname, '../src/config/stage/plugins.js')
const pluginsPath = path.resolve(__dirname, '../src/plugins')
const templatePath = path.resolve(__dirname, './template/plugin-stage-config.js.ejs')
const template = fs.readFileSync(templatePath, 'utf8')
const puginList = getAllPlugin(pluginsPath)


const result = ejs.render(template, { plugins: puginList })

fs.writeFile(targetDir, result)

// eslint-disable-next-line
console.log(chalk.green(`插件配置完成: ${targetDir}\n`))
