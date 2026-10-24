# Contributing

## Development

### Building

```bash
# Build all crates
cargo build

# Build specific crate
cargo build -p tagver-cli

# Build release version
cargo build --release
```

### Testing

```bash
# Run all tests
cargo test

# Run tests for specific crate
cargo test -p tagver

# Run integration tests
cargo test --test integration
```

### Homebrew formula regression

After `cargo build --workspace`, run:

```bash
python3 -m unittest discover -s scripts -p 'test_homebrew_formula.py'
python3 scripts/test-homebrew-formula.py --binary target/debug/tagver
```

This Linux x86_64 check selects the highest bare SemVer tag using Git's version
sort from the repository checkout. CI uses `fetch-depth: 0` so the tags are
available; local checkouts also need the release tags. It downloads that release's
archives and `SHA256SUMS` directly from `github.com` without API calls and verifies
each required archive entry. The manifest's self-entry is not verified. It executes
the `Generate formula` step from
`.github/workflows/release.yml` in a temporary directory. It checks the assertion
from the generated formula against both the released executable and the built
CLI. Python's standard library and the existing CI tools are sufficient; no tap
checkout, Homebrew installation or publishing credentials are used. Public release
downloads must be reachable. CI runs these checks after the build.

### Example repositories

To test the implementation, you can create example Git repositories:

```bash
# Linear history with tags
git init linear-test
cd linear-test
git commit --allow-empty -m "Initial commit"
git tag 1.0.0
git commit --allow-empty -m "Second commit"
git commit --allow-empty -m "Third commit"

# Test with MinVer
minver --working-directory linear-test
```

## Releasing

[Intentional](https://wyrd.foo/docs/intentional/) is the only mechanism for
versions and releases. Do not edit the version in `crates/*/Cargo.toml`
(including the `tagver` dependency ranges in `crates/cli/Cargo.toml`), edit
`CHANGELOG.md`, or create release tags by hand. The configuration lives in `.intentional/config.yml`:
one release unit, `tagver`, projected onto both crate manifests and tagged with
bare SemVer (no `v` prefix, e.g. `1.2.3`).

1. **Intent.** Every pull request with a user-facing change adds an intent:

   ```bash
   intentional add --release-unit tagver:patch \
     --message "Describe the user-visible outcome."
   ```

   Use `major`, `minor`, or `patch`; before 1.0 the configured compatibility
   mapping applies. Commit the intent with the change.
2. **Status.** `intentional status` shows pending intents and the next version;
   `intentional check` validates configuration, intents, and tag history.
3. **Plan.** `intentional plan > release-plan.json` saves the digest-bound plan.
4. **Apply.** `intentional apply` writes the changelog, bumps both manifests and
   the dependency ranges, and consumes the intents. Run `cargo update --workspace`
   so `Cargo.lock` follows the new version, then commit it all as the only change
   in the release pull request.
5. **Tag.** After the release commit is on `main`,
   `intentional tag --plan release-plan.json` creates the annotated tag. Push it.

Pushing the tag runs the `Release` workflow. It verifies that the package versions
match the tag, builds and checksums binaries for all targets with `--locked` (so a
stale `Cargo.lock` fails the release), creates the GitHub Release, publishes to
crates.io, and updates the Homebrew tap.

## Code Style

- Run `cargo fmt --all` before committing
- Ensure `cargo clippy --workspace --all-targets -- -D warnings` passes
- Follow Rust naming conventions and prefer small, focused functions

## Pull Request Process

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`)
2. Make your changes with appropriate tests
3. Run `cargo fmt --all`, `cargo clippy --workspace --all-targets -- -D warnings`, and `cargo test --workspace`
4. Ensure commits are focused and well-described
5. Open a pull request with a clear summary and testing notes

## Reporting Issues

When filing an issue, please include:
- `tagver` version (`tagver --version`)
- Rust version (`rustc --version`)
- Operating system and shell
- Reproduction steps and expected vs. actual behavior
