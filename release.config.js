module.exports = {
  release: {
    branches: ['main', 'next'],
    // '@semantic-release/npm',
    plugins: ['@semantic-release/commit-analyzer', '@semantic-release/release-notes-generator', '@semantic-release/github']
  }
}
