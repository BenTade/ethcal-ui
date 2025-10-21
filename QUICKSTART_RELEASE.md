# Quick Start: Publishing Release v1.0.0

## TL;DR - Fastest Way to Publish

After this PR is merged to main:

```bash
git checkout main
git pull origin main
./scripts/publish-release.sh
```

That's it! The script will handle everything and tell you the next steps.

## What This Does

The script will:
1. ✓ Verify version 1.0.0 in package.json
2. ✓ Build the project (`npm run build`)
3. ✓ Create GitHub tag `v1.0.0`
4. ✓ Create GitHub release with release notes
5. ✓ Show next steps for npm/Packagist publishing

## Alternative: Manual GitHub Release

If you prefer to do it manually through GitHub web interface:

1. Visit: https://github.com/BenTade/ethcal-ui/releases/new
2. Tag: `v1.0.0` (create new tag)
3. Title: `Release v1.0.0`
4. Description: Copy from `RELEASE_NOTES.md`
5. Click **Publish release**

## After Publishing the GitHub Release

### Publish to npm (Optional)
```bash
npm login
npm publish
```

### Publish to Packagist (Optional)
1. Visit: https://packagist.org/packages/submit
2. Submit: `https://github.com/BenTade/ethcal-ui`

## Verification

Check these URLs after publishing:
- GitHub Release: https://github.com/BenTade/ethcal-ui/releases/tag/v1.0.0
- npm Package: https://www.npmjs.com/package/ethcal-ui
- CDN: https://unpkg.com/ethcal-ui@1.0.0/

## Need More Details?

- Complete checklist: See [RELEASE_v1.0.0.md](RELEASE_v1.0.0.md)
- Full documentation: See [RELEASING.md](RELEASING.md)
- Development guide: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Note**: This PR has prepared everything needed for the v1.0.0 release. The actual release will be created when the above steps are executed after merging to main.
