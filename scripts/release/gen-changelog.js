const fs = require('fs')
const path = require('path')
const execa = require('execa')

async function genNewRelease() {
  const nextVersion = require('../../lerna.json').version
  const { stdout } = await execa(require.resolve('lerna-changelog/bin/cli'), [
    '--next-version',
    nextVersion
  ])
  console.log(nextVersion, stdout)
  return stdout
}

const gen = (module.exports = async () => {
  const newRelease = await genNewRelease()
  const changelogPath = path.resolve(__dirname, '../../CHANGELOG.md')
  const fileExists = fs.existsSync(changelogPath)

  let newChangelog = newRelease
  if (fileExists) {
    newChangelog =
      `${newRelease}\n\n\n${fs.readFileSync(changelogPath, { encoding: 'utf8' })}`
  }

  fs.writeFileSync(changelogPath, newChangelog)
})

if (require.main === module) {
  gen().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
