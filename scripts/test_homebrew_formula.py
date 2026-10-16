# relationships:
#   references: test-homebrew-formula.py
"""Regression guards for selecting and verifying published release inputs."""

import hashlib
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


spec = importlib.util.spec_from_file_location(
    "formula_regression", Path(__file__).with_name("test-homebrew-formula.py")
)
regression = importlib.util.module_from_spec(spec)
spec.loader.exec_module(regression)


class ReleaseTagTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.repository = Path(self.temporary.name)
        self.git("init", "--quiet")
        self.git("-c", "user.name=Example", "-c", "user.email=developer@example.com",
                 "commit", "--quiet", "--allow-empty", "-m", "Initial")

    def git(self, *arguments):
        subprocess.run(["git", *arguments], cwd=self.repository, check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

    def test_highest_bare_semver_uses_version_sort(self):
        for tag in ("0.9.0", "0.10.0", "v99.0.0", "99", "99.0.0-rc.1",
                    "99.0.0+metadata", "099.0.0"):
            self.git("tag", tag)
        self.assertEqual(regression.current_release(self.repository), "0.10.0")

    def test_missing_release_tags_fails(self):
        self.git("tag", "v1.0.0")
        with self.assertRaisesRegex(AssertionError, "No bare SemVer release tag"):
            regression.current_release(self.repository)


class PublishedChecksumTests(unittest.TestCase):
    name = "tool-linux-amd64.tar.gz"
    content = b"release archive"
    digest = hashlib.sha256(content).hexdigest()

    def manifest(self):
        return f"{self.digest}  ./tool-linux-amd64/{self.name}\n"

    def test_archive_entry_passes_without_manifest_self_hash(self):
        checksums = "0" * 64 + "  ./SHA256SUMS\n" + self.manifest()
        self.assertEqual(regression.verify_archive(self.name, self.content, checksums),
                         self.digest)

    def test_changed_archive_bytes_fail(self):
        with self.assertRaisesRegex(AssertionError, "Published checksum mismatch"):
            regression.verify_archive(self.name, self.content + b"changed", self.manifest())

    def test_missing_checksum_fails(self):
        with self.assertRaisesRegex(AssertionError, "Expected one published checksum"):
            regression.verify_archive(self.name, self.content, "")

    def test_unrelated_checksum_fails(self):
        with self.assertRaisesRegex(AssertionError, "Expected one published checksum"):
            regression.verify_archive(self.name, self.content,
                                      f"{self.digest}  ./other-archive.tar.gz\n")

    def test_duplicate_checksum_fails(self):
        with self.assertRaisesRegex(AssertionError, "Expected one published checksum"):
            regression.verify_archive(self.name, self.content, self.manifest() * 2)

    def test_malformed_checksum_fails(self):
        with self.assertRaisesRegex(AssertionError, "Expected one published checksum"):
            regression.verify_archive(self.name, self.content, f"invalid  {self.name}\n")


if __name__ == "__main__":
    unittest.main()
