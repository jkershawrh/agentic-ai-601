from pathlib import Path

import yaml


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


def test_handoff_uses_canonical_launchpad_prerequisites_and_stays_fail_closed():
    handoff = yaml.safe_load((ROOT / "handoff/launchpad-handoff.yaml").read_text())
    authority = handoff["factory_receipt"]["authority"]
    assert authority["orderable"] is False
    assert authority["certified"] is False
    assert authority["promotion_eligible"] is False

    learning = handoff["proposed_launchpad_intake"]["learning"]
    assert learning["prerequisites"] == [
        "operate-agentic-blueprint",
        "scale-agentic-blueprint",
    ]
    assert learning["branches_from"] == "scale-agentic-blueprint"


def test_release_fails_closed_before_immutable_publication():
    workflow = (ROOT / ".github/workflows/release.yml").read_text()
    assert "python -m pytest -q tests/publication" in workflow
    assert "Build Linux AMD64 candidate without publishing" in workflow
    assert workflow.index("Reject HIGH or CRITICAL vulnerabilities") < workflow.index(
        "Publish and verify exact immutable digest"
    )
    assert ":latest" not in workflow
    assert "vulnerability-${{ matrix.name }}.json" in workflow


def test_presentation_runtime_has_no_os_package_surface():
    containerfile = (ROOT / "packaging/Containerfile").read_text()
    server = (ROOT / "packaging/static-server.go").read_text()

    assert "FROM scratch" in containerfile
    assert 'ENTRYPOINT ["/static-server"]' in containerfile
    assert "CGO_ENABLED=0" in containerfile
    assert 'http.ListenAndServe(":8080", nil)' in server
    assert 'http.HandleFunc("/healthz", textOK)' in server
