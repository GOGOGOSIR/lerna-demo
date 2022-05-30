module.exports = {
  release: {
    branches: ['master', 'next'],
    // '@semantic-release/npm',
    // dryRun: true,
    plugins: ['@semantic-release/commit-analyzer', '@semantic-release/release-notes-generator', '@semantic-release/github']
  }
}
