Output docs/demo.gif

Require bash
Require git

Set Shell "bash"
Set FontSize 24
Set Width 1200
Set Height 720
Set Theme "Catppuccin Mocha"
Set Padding 24
Set Margin 12
Set MarginFill "#11111b"
Set BorderRadius 8
Set WindowBar "Colorful"
Set TypingSpeed 35ms

Hide
Type "export PATH=/workspaces/tagver/target/debug:$PATH" Enter
Type "export LD_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/lib:${LD_LIBRARY_PATH:-}" Enter
Type "rm -rf /tmp/tagver-vhs-demo && mkdir -p /tmp/tagver-vhs-demo && cd /tmp/tagver-vhs-demo" Enter
Type "git init -q" Enter
Type "git config user.email demo@example.com" Enter
Type "git config user.name 'TagVer Demo'" Enter
Type "echo 'name = demo' > Cargo.toml" Enter
Type "git add Cargo.toml && git commit -q -m 'Initial commit'" Enter
Type "git tag 1.2.3" Enter
Type "echo 'fn main() {}' > main.rs" Enter
Type "git add main.rs && git commit -q -m 'Add application entry point'" Enter
Show
Ctrl+L

Sleep 500ms
Type "git log --oneline --decorate --graph -3" Enter
Sleep 1s

Type "tagver" Enter
Sleep 1s

Type "tagver --format json" Enter
Sleep 5s
