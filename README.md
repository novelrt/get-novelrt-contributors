# Using GitHub Actions & Octokit to make Contributors JSON file

Based off of this [Octokit Example](https://github.com/octokit/action.js)

This script leverages the fact that GitHub provides a token that you can use to authenticate on behalf of GitHub Actions. [Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

Octokit is used because it does not require any configuration, but instead reads the GITHUB_TOKEN environment variable that is provided to GitHub Actions.

The important code files in this repo are:

- .github/actions/my-script.mjs
- .github/workflows/my-node-action.yml

When the action runs it creates the file data.json
