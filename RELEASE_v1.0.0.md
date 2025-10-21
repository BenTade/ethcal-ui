# Version 1.0.0 Release Checklist

This document provides a step-by-step checklist for publishing version 1.0.0 of ethcal-ui.

## Pre-Release Checklist

- [x] Version 1.0.0 is set in `package.json`
- [x] CHANGELOG.md has entry for version 1.0.0
- [x] All features documented in README.md
- [x] Build succeeds: `npm run build`
- [x] All distribution files generated in `dist/` directory
- [x] Examples are working and up-to-date
- [x] GitHub Actions workflow for releases created
- [x] Release notes prepared (RELEASE_NOTES.md)
- [x] Release documentation created (RELEASING.md)
- [x] Release script created (scripts/publish-release.sh)

## Publishing the Release

### Option 1: Using the Release Script (Recommended)

After this PR is merged to main:

```bash
# Pull the latest main branch
git checkout main
git pull origin main

# Run the release script
./scripts/publish-release.sh
```

The script will:
- Verify the version in package.json
- Build the project
- Create a GitHub release with tag v1.0.0
- Display next steps

### Option 2: Using GitHub CLI Manually

```bash
# Ensure you're on main branch with latest code
git checkout main
git pull origin main

# Build the project
npm run build

# Create the release
gh release create v1.0.0 \
    --title "Release v1.0.0" \
    --notes-file RELEASE_NOTES.md \
    --target main
```

### Option 3: Using GitHub Web Interface

1. Go to https://github.com/BenTade/ethcal-ui/releases/new
2. In "Choose a tag", type `v1.0.0`
3. Select "Create new tag: v1.0.0 on publish"
4. Set "Release title" to: `Release v1.0.0`
5. Copy the content from `RELEASE_NOTES.md` into the description box
6. Click "Publish release"

## Post-Release Tasks

### Publish to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish
```

Verify at: https://www.npmjs.com/package/ethcal-ui

### Publish to Packagist (for PHP/Composer)

1. Go to https://packagist.org/packages/submit
2. Submit the GitHub repository URL: https://github.com/BenTade/ethcal-ui
3. Packagist will automatically track future releases from GitHub tags

Verify at: https://packagist.org/packages/bentade/ethcal-ui

### Verification Checklist

After publishing, verify:

- [ ] Tag v1.0.0 exists at: https://github.com/BenTade/ethcal-ui/tags
- [ ] Release appears at: https://github.com/BenTade/ethcal-ui/releases
- [ ] Release notes are displayed correctly
- [ ] Source code downloads are available (zip and tar.gz)
- [ ] Package is available on npm: https://www.npmjs.com/package/ethcal-ui
- [ ] CDN links work:
  - [ ] https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.css
  - [ ] https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.umd.js
  - [ ] https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.esm.js
  - [ ] https://unpkg.com/ethcal-ui@1.0.0/dist/ethcal-ui.cjs.js
- [ ] Package is available on Packagist (if submitted)

## Announcement

After successful release, consider:

1. Update any related documentation or wiki
2. Announce on social media or relevant communities
3. Update any demos or live examples
4. Close related milestone (if any)

## Rollback Procedure

If you need to rollback the release:

1. Delete the release from GitHub releases page
2. Delete the tag:
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```
3. If published to npm (within 72 hours):
   ```bash
   npm unpublish ethcal-ui@1.0.0
   ```

## Support

For questions or issues with the release process, see:
- [RELEASING.md](RELEASING.md) - Detailed release documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- GitHub Issues: https://github.com/BenTade/ethcal-ui/issues
