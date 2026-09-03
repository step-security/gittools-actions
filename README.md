[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# GitTools actions

GitHub Action that allows the use of [GitVersion](https://github.com/GitTools/GitVersion) to easily calculate semantic versions for projects using Git.

[![CI Build Status](https://github.com/step-security/gittools-actions/workflows/CI/badge.svg)](https://github.com/step-security/gittools-actions/actions)

[![GitHub Release](https://img.shields.io/github/v/release/step-security/gittools-actions?logo=github&sort=semver)](https://github.com/step-security/gittools-actions/releases/latest)

## Usage

### GitVersion Execute

Examples for usage of **GitVersion Execute**:

- [GitHub Actions](docs/examples/github/gitversion/execute.md)



### Prerequisites

1. **Linux** - Recommended to build and run
2. **Node.js** - Latest LTS version recommended
3. **.NET SDK** - Version 8.0 or later required for GitVersion
4. **Git** - Latest version recommended

### Generated Output

This repository commits generated `.mjs` bundles in `dist/` and `gitversion/execute/` because those are the published artifacts. After changing `src/`, run `npm run build` and include the generated output in your commit. Do not edit generated `.mjs` files by hand.

### Required Knowledge

- **TypeScript/JavaScript** - Primary development languages
- **GitHub Actions** - Understanding of action creation and workflows
- **.NET Tools** - Basic understanding of .NET CLI tools
- **Git** - Strong knowledge of Git versioning

### Project Structure

- `src/tools/` - Core implementation of GitVersion integration
- `src/agents/` - Build agent implementations
- `src/__tests__/` - Test suites organized by component
- `docs/examples/` - Usage examples for GitHub Actions
