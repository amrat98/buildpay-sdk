# Publishing the BuildPay SDK to npm

This guide explains how to publish the BuildPay SDK to npm.

## Prerequisites

1. **npm account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup) if you don't have one.
2. **npm CLI**: Make sure you have npm installed (comes with Node.js).

## Steps to Publish

### 1. Login to npm

First, login to your npm account from the command line:

```bash
cd sdk
npm login
```

You'll be prompted for your npm username, password, and email.

### 2. Verify Package Details

Before publishing, verify that the package.json has the correct information:

```bash
cat package.json
```

Check:
- Package name (`buildpay-sdk`) - Make sure it's not already taken on npm
- Version number (start with `1.0.0`)
- Description, author, license, repository URL

### 3. Test the Package Locally

You can test the package locally before publishing:

```bash
# Create a tarball
npm pack

# This creates a .tgz file that you can install in another project for testing
# In another project directory:
npm install /path/to/buildpay-sdk-1.0.0.tgz
```

### 4. Publish to npm

When you're ready to publish:

```bash
# For public package (free)
npm publish --access public

# For scoped package (e.g., @your-org/buildpay-sdk)
npm publish --access public
```

### 5. Verify Publication

After publishing, verify that your package is available:

```bash
npm view buildpay-sdk

# Or visit
# https://www.npmjs.com/package/buildpay-sdk
```

## Publishing Updates

When you need to publish an update:

### 1. Update the Version

Follow semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Patch release (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor release (new features, backward compatible): 1.0.0 -> 1.1.0
npm version minor

# Major release (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

This will automatically:
- Update the version in package.json
- Create a git commit with the version change
- Create a git tag

### 2. Update CHANGELOG.md

Document your changes in the CHANGELOG.md file.

### 3. Publish the Update

```bash
npm publish
```

### 4. Push to Git

```bash
git push origin main --tags
```

## Using a Scoped Package

If you want to publish under your organization name (e.g., `@buildpay/sdk`):

1. Update package.json:
   ```json
   {
     "name": "@buildpay/sdk",
     ...
   }
   ```

2. Publish:
   ```bash
   npm publish --access public
   ```

## Unpublishing (Use with Caution)

To unpublish a specific version within 72 hours of publishing:

```bash
npm unpublish buildpay-sdk@1.0.0
```

To unpublish all versions (only within 72 hours):

```bash
npm unpublish buildpay-sdk --force
```

**Note**: Unpublishing is permanent and should only be done in exceptional circumstances.

## Best Practices

1. **Always test before publishing**: Use `npm pack` and test locally
2. **Use semantic versioning**: Follow the MAJOR.MINOR.PATCH convention
3. **Keep a changelog**: Document all changes between versions
4. **Review files included**: Check what files will be published with `npm pack --dry-run`
5. **Use .npmignore**: Exclude unnecessary files from the published package
6. **Add badges**: Add npm version and download badges to your README
7. **Create a GitHub release**: Tag releases in GitHub for better tracking

## Troubleshooting

### Package name already exists
If the name `buildpay-sdk` is taken, you can:
- Use a scoped package: `@your-org/buildpay-sdk`
- Choose a different name: `buildpay-client`, `buildpay-js`, etc.

### Authentication failed
```bash
npm logout
npm login
```

### Files not included in package
Check your:
- `.npmignore` file
- `files` field in package.json
- `.gitignore` (if no .npmignore exists)

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Creating and Publishing npm Packages](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
