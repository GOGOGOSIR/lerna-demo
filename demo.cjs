console.log(process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN)
const fs = require('fs')
const execa = require('execa')

const res = fs.readFileSync('./lerna.json', 'utf8')
const res2 = fs.readFileSync('./package.json', 'utf8')
const version = JSON.parse(res).version
const pkgData = JSON.parse(res2)
pkgData.version = version
fs.writeFileSync('./package.json', JSON.stringify(pkgData))
execa('npx', ['prettier', '--no-config', '--write', './package.json'])
console.log(JSON.parse(res).version)
