# Release Scripts

This directory contains scripts to help with releasing new versions of ethcal-ui.

## publish-release.sh

Script to publish version 1.0.0 to GitHub.

### Prerequisites

- [GitHub CLI (gh)](https://cli.github.com/) installed and authenticated
- Node.js and npm installed
- Write access to the repository

### Usage

```bash
# From the repository root
./scripts/publish-release.sh
```

This script will:
1. Verify the version in package.json
2. Build the project
3. Create a GitHub release with tag v1.0.0
4. Display next steps for npm and Packagist publishing

### Manual Alternative

If you prefer to create the release manually:

1. Go to https://github.com/BenTade/ethcal-ui/releases/new
2. Enter tag: `v1.0.0`
3. Select "Create new tag: v1.0.0 on publish"
4. Set release title: `Release v1.0.0`
5. Copy content from `RELEASE_NOTES.md` into the description
6. Click "Publish release"

### After Publishing

See [RELEASING.md](../RELEASING.md) for complete release documentation including:
- Publishing to npm
- Publishing to Packagist
- Verifying the release
