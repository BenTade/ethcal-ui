# How to Publish a Release

This document explains how to publish a new release of ethcal-ui.

## Prerequisites

1. Make sure you have push access to the repository
2. Ensure all changes are committed and pushed to the main branch
3. Update CHANGELOG.md with the new version details
4. Update package.json version number if needed
5. Ensure the build works: `npm run build`

## Publishing Version 1.0.0 (First Release)

### Option 1: Using GitHub UI (Recommended for first release)

1. Go to https://github.com/BenTade/ethcal-ui/releases
2. Click "Draft a new release"
3. In "Choose a tag", type `v1.0.0` and select "Create new tag: v1.0.0 on publish"
4. Set "Release title" to: `Release v1.0.0`
5. Copy the content from `RELEASE_NOTES.md` into the description
6. Click "Publish release"

This will:
- Create the v1.0.0 tag
- Create the GitHub release
- Trigger the release workflow (if configured)

### Option 2: Using Git Command Line

```bash
# Create and push the tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

This will:
- Create the v1.0.0 tag
- Trigger the GitHub Actions workflow that will create the release automatically

### Option 3: Using GitHub CLI

```bash
# Create a release with the tag
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file RELEASE_NOTES.md
```

## Publishing to npm

To publish the package to npm (requires npm account and authentication):

```bash
# Login to npm (one time)
npm login

# Publish the package
npm publish
```

Or set up an npm token in GitHub Secrets:
1. Generate an npm access token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add it as `NPM_TOKEN` in repository secrets
3. The GitHub Actions workflow will automatically publish on tag push

## Publishing to Composer/Packagist

The PHP version is already configured in `composer.json`. To make it available via Packagist:

1. Go to https://packagist.org/packages/submit
2. Submit the GitHub URL: https://github.com/BenTade/ethcal-ui
3. Packagist will automatically detect new releases from GitHub tags

## Future Releases

For subsequent releases:

1. Update the version in `package.json`
2. Update `CHANGELOG.md` with new changes
3. Commit the changes
4. Follow any of the options above with the new version number

## Automated Release Workflow

A GitHub Actions workflow (`.github/workflows/release.yml`) has been configured to:
- Trigger on tag push (tags starting with 'v')
- Build the project
- Create a GitHub release
- Optionally publish to npm (if NPM_TOKEN is configured)

## Verification

After publishing, verify:
- [ ] Tag appears at https://github.com/BenTade/ethcal-ui/tags
- [ ] Release appears at https://github.com/BenTade/ethcal-ui/releases
- [ ] Package is available on npm (if published): https://www.npmjs.com/package/ethcal-ui
- [ ] CDN links work: https://unpkg.com/ethcal-ui@1.0.0/

## Rollback

If you need to remove a release:
- Delete the release from GitHub UI
- Delete the tag: `git tag -d v1.0.0 && git push origin :refs/tags/v1.0.0`
- If published to npm, you can unpublish within 72 hours: `npm unpublish ethcal-ui@1.0.0`
