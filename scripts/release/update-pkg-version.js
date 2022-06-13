const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = async (version) => {
  const res = fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf8')
  const pkgData = JSON.parse(res)
  pkgData.version = version
  fs.writeFileSync('./package.json', JSON.stringify(pkgData))
  await execa('npx', ['prettier', '--no-config', '--write', path.resolve(process.cwd(), './package.json')])
}
