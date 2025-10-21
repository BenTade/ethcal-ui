#!/bin/bash

# Release script for ethcal-ui version 1.0.0
# This script creates a GitHub release for version 1.0.0

set -e  # Exit on error

VERSION="1.0.0"
TAG="v${VERSION}"

echo "========================================="
echo "Publishing ethcal-ui Release ${TAG}"
echo "========================================="
echo

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    echo
    echo "Alternatively, you can create the release manually:"
    echo "1. Go to https://github.com/BenTade/ethcal-ui/releases/new"
    echo "2. Create tag: ${TAG}"
    echo "3. Use the content from RELEASE_NOTES.md"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Must be run from the repository root"
    exit 1
fi

# Verify version in package.json
PACKAGE_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
if [ "$PACKAGE_VERSION" != "$VERSION" ]; then
    echo "Error: package.json version ($PACKAGE_VERSION) doesn't match release version ($VERSION)"
    exit 1
fi

echo "✓ Version verified in package.json"

# Build the project
echo
echo "Building project..."
npm run build

echo "✓ Build successful"

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo
    echo "Warning: Tag $TAG already exists locally"
    read -p "Do you want to continue and update it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    git tag -d "$TAG"
fi

# Create the release using GitHub CLI
echo
echo "Creating GitHub release..."
gh release create "$TAG" \
    --title "Release $TAG" \
    --notes-file RELEASE_NOTES.md \
    --target main

echo
echo "========================================="
echo "✓ Release $TAG published successfully!"
echo "========================================="
echo
echo "Next steps:"
echo "1. Verify the release at: https://github.com/BenTade/ethcal-ui/releases"
echo "2. To publish to npm, run: npm publish"
echo "3. To publish to Packagist, submit at: https://packagist.org/packages/submit"
echo
echo "CDN links will be available at:"
echo "  https://unpkg.com/ethcal-ui@${VERSION}/"
echo
