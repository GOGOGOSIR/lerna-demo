// const path = require('path')
const execa = require('execa')
const semver = require('semver')
const inquirer = require('inquirer')
const currentVersion = require('../../lerna.json').version

const release = async () => {
  console.log(`Current version: ${currentVersion}`)

  const bumps = ['patch', 'minor', 'major', 'prerelease']
  const versions = {}
  bumps.forEach((b) => { versions[b] = semver.inc(currentVersion, b) })
  const bumpChoices = bumps.map(b => ({ name: `${b} (${versions[b]})`, value: b }))

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [...bumpChoices, { name: 'custom', value: 'custom' }]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: answers => answers.bump === 'custom'
    }
  ])

  const version = customVersion || versions[bump]

  let distTag = 'latest'
  if (bump === 'prerelease' || semver.prerelease(version))
    distTag = 'next'

  const lernaArgs = [
    'publish',
    version,
    '--dist-tag',
    distTag,
    '--conventional-commits'
  ]

  lernaArgs.push('--force-publish')

  try {
    await execa(require.resolve('lerna/cli'), lernaArgs, { stdio: 'inherit' })
    // await execa('node', [path.resolve(__dirname, './gen-changelog.js')], { stdio: 'inherit' })

    const { stdout } = await execa('git', ['branch', '-a'])
    const hasDevBranch = stdout.split('\n').some(b => b.includes('main'))
    if (hasDevBranch) {
      await execa('git', ['checkout', 'dev'], { stdio: 'inherit' })
      await execa('git', ['rebase', 'main'], { stdio: 'inherit' })
    } else {
      await execa('git', ['checkout', '-b', 'dev'], { stdio: 'inherit' })
    }
    await execa('git', ['push', 'origin', 'dev'], { stdio: 'inherit' })
    await execa('git', ['checkout', 'main'], { stdio: 'inherit' })
  } catch (err) {
    console.error(err)
  }
}

release().catch((err) => {
  console.error(err)
  process.exit(1)
})
