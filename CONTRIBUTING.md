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
