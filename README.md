# Agentic AI 601 — Earn the Right to Act

Research and qualification candidate for a governed, reversible closed loop:

`Signal → Decision → Action → Validate → Learn`

The repository contains a concise Red Hat × Intel Triforce-style presentation, a separate Showroom lab, a deterministic qualification service, versioned authority/evidence/evaluation contracts, Helm packaging, and a deliberately non-certified Launchpad handoff.

## Safety state

- Production execution authority: **disabled**
- Catalog certification: **not earned**
- Orderable: **false**
- Permitted action: one synthetic restart simulation inside `agentic-ai-601-lab-*`
- External remediation: **not implemented**
- Promotion: human-owned and class-specific
- Demotion: automatic on failed validation or safety gates

GCL, agent passport, immutable ledger, and `rossoctl` are research concepts. OpenShell is treated as an upstream alpha / OpenShift AI Developer Preview integration and is not used as production authority.

## Verify

```bash
npm ci
npm run check
npm run test:visual
```

Run the qualification service locally:

```bash
npm run build:server
PORT=8090 npm run start:server
```

## Factory outputs

- `demo-blueprint.yaml` and `story.brief.yaml`: the seven-scene decision story.
- `showroom/`: the separate eight-stage hands-on lab.
- `contracts/`: versioned, deterministic authority and evidence contracts.
- `server/`: the lab-only qualification service and emergency stop.
- `charts/agentic-ai-601/`: fail-closed OpenShift packaging with digest-only images.
- `tests/`: the acceptance matrix, claim registry, benchmark rubric, and executable tests.
- `handoff/`: a proposed Launchpad intake that grants no certification or publication authority.

The release workflow builds Linux AMD64 images, rejects any HIGH or CRITICAL
finding, publishes SPDX JSON SBOMs, and uses Sigstore with GitHub OIDC to sign
each immutable digest and attach SLSA v1 provenance. Exact reviewed digests live
in the handoff rather than being committed back into the source revision that
built them.
