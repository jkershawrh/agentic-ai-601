from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_readme_has_launchpad_sections():
    text = (ROOT / "README.md").read_text(encoding="utf-8")
    for heading in (
        "## Table of contents",
        "## Overview",
        "## Architecture",
        "## Requirements",
        "## Deploy",
        "## Repository structure",
        "## Tags",
        "## References",
    ):
        assert heading in text


def test_readme_preserves_fail_closed_authority():
    text = " ".join(
        (ROOT / "README.md").read_text(encoding="utf-8").lower().split()
    )
    assert "authority execution disabled" in text
    assert "human reviewer" in text
    assert "not directly orderable" in text


def test_standard_evidence_artifacts_are_present():
    for relative in (
        "tests/validation_matrix.yaml",
        "tests/claim_registry.yaml",
        "tests/benchmark_rubric.yaml",
    ):
        assert (ROOT / relative).is_file()
