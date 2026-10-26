# Changelog

## 0.1.7

### Fixes

- Publish the `tagver` and `tagver-cli` crates to crates.io with trusted
  publishing. Releases 0.1.5 and 0.1.6 were never published to crates.io.

## 0.1.6

### Breaking

- Building from source now requires Rust 1.88 or later, so that TagVer can use
  gix 0.89.

### Fixes

- Warn instead of failing when the repository's shallow state cannot be read.
- Generate Homebrew formulae that pass strict audit and style checks.

## 0.1.5

### Fixes

- Point the crate metadata, the README, and the GitHub Action at the
  `wyrd-company/tagver` repository, and add a command-line demo to the README.

## 0.1.4

### Fixes

- Fix publishing formula updates to the Homebrew tap.

## 0.1.3

### Fixes

- Do not move the floating major version tag for pre-1.0 releases, so that
  consumers pin specific versions until 1.0.0.

## 0.1.2

### Features

- Add a GitHub Action that downloads the prebuilt `tagver` binary and exposes
  the calculated version and its components as outputs.
- Install with Homebrew from the `wyrd-company/tools` tap.

## 0.1.1

### Features

- Calculate a SemVer version from Git tags and commit height, as a Rust port of
  the MinVer CLI. Options cover the tag prefix, auto-increment, default
  pre-release identifiers, minimum major and minor, ignoring height, build
  metadata, and verbosity. Each option can also be set with a `TAGVER_`
  environment variable.
- Print the version as text or as JSON with `--format`.
- Publish the `tagver` library crate and the `tagver-cli` command-line crate.
- Attach prebuilt binaries for Linux (x86_64 and arm64), macOS (arm64), and
  Windows (x86_64), with a `SHA256SUMS` file, to the GitHub release.
