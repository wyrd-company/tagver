#!/usr/bin/env python3
# relationships:
#   references:
#     - ../.github/workflows/release.yml
#     - ../.github/workflows/ci.yml
"""Check the generated Homebrew assertion against released and built CLIs."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import tarfile
import tempfile
import textwrap
import urllib.request


ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = "wyrd-company/tagver"


def download(url):
    request = urllib.request.Request(url, headers={"User-Agent": "tagver-formula-test"})
    with urllib.request.urlopen(request) as response:
        return response.read()


def generator_script(workflow):
    """Read the real literal run block, without a separate generator fixture."""
    match = re.search(
        r"^      - name: Generate formula\n(?:(?!      - ).*\n)*?"
        r"        run: \|\n((?:          .*\n|\n)+)",
        workflow,
        re.MULTILINE,
    )
    if not match:
        raise AssertionError("Cannot find the workflow's Generate formula run block")
    return textwrap.dedent(match[1]).rstrip("\n") + "\n"


def generated_test(formula):
    # Fail closed if the generator changes the smoke test syntax. The expected
    # text comes from the rendered formula, never a duplicated test string.
    match = re.search(
        r'  test do\n    assert_match ("[^"\n]+"), '
        r'shell_output\("#\{bin\}/tagver ([^"\n]+)"\)\n  end\n',
        formula,
    )
    if not match:
        raise AssertionError("Expected one generated CLI assert_match smoke test")
    return json.loads(match[1]), shlex.split(match[2])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--binary", type=Path, required=True, help="Built Tagver CLI")
    args = parser.parse_args()
    built_binary = args.binary.resolve(strict=True)
    release = json.loads(download(f"https://api.github.com/repos/{REPOSITORY}/releases/latest"))
    tag = release["tag_name"]
    print(f"Testing generated formula against published release {tag}", flush=True)
    assets = {asset["name"]: asset for asset in release["assets"]}

    with tempfile.TemporaryDirectory(prefix="tagver-formula-test-") as temporary:
        work = Path(temporary)
        for platform in ("linux-x86_64", "linux-arm64", "macos-arm64"):
            name = f"tagver-{platform}.tar.gz"
            asset = assets[name]
            content = download(asset["browser_download_url"])
            digest = "sha256:" + hashlib.sha256(content).hexdigest()
            if digest != asset["digest"]:
                raise AssertionError(f"Published digest mismatch for {name}")
            archive = work / "artifacts" / f"tagver-{platform}" / name
            archive.parent.mkdir(parents=True)
            archive.write_bytes(content)
            print(f"Verified {tag}/{name} {digest}", flush=True)
            if platform == "linux-x86_64":
                with tarfile.open(archive) as package:
                    binary = package.extractfile("tagver-linux-x86_64/tagver")
                    if binary is None:
                        raise AssertionError("Release archive has no Tagver executable")
                    released_binary = work / "released-tagver"
                    released_binary.write_bytes(binary.read())
                    released_binary.chmod(0o755)

        (work / "homebrew-tools" / "Formula").mkdir(parents=True)
        workflow = (ROOT / ".github/workflows/release.yml").read_text()
        subprocess.run(
            ["bash", "-euo", "pipefail", "-c", generator_script(workflow)],
            cwd=work,
            env={**os.environ, "TAG": tag, "VERSION": tag.removeprefix("v"),
                 "REPOSITORY": REPOSITORY},
            check=True,
        )
        formula = (work / "homebrew-tools/Formula/tagver.rb").read_text()
        expected, arguments = generated_test(formula)
        for label, binary in ((f"release {tag}", released_binary), ("built CLI", built_binary)):
            output = subprocess.check_output([str(binary), *arguments], text=True)
            if expected not in output:
                raise AssertionError(
                    f"Generated assertion {expected!r} missing from {label} output:\n{output}"
                )
            print(f"PASS: generated assertion {expected!r} matches {label}", flush=True)


if __name__ == "__main__":
    main()
