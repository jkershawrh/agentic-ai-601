from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OVERVIEW = ROOT / "showroom/modules/ROOT/pages/index.adoc"
CLOSE = ROOT / "showroom/modules/ROOT/pages/07-close-handoff.adoc"


def test_601_is_the_explicit_governed_progression_from_401_and_501():
    content = OVERVIEW.read_text()
    for marker in (
        "== Story",
        "Show → Learn → Do → Prove",
        "Agentic AI 401",
        "Agentic AI 501",
        "REHEARSAL",
        "production execution authority is disabled",
    ):
        assert marker in content


def test_601_closes_with_truthful_cleanup_and_reclaim_ownership():
    content = CLOSE.read_text()
    assert "== Cleanup and Reclaim Boundary" in content
    assert "in-memory evidence" in content
    assert "Launchpad reclaim" in content
    assert "zero residue" in content


def test_601_truthfully_declares_operator_and_inference_boundaries():
    content = " ".join(OVERVIEW.read_text().split())
    assert "installs no optional OpenShift Operator" in content
    assert "performs zero model inference" in content
    assert "no model endpoint, token use" in content
