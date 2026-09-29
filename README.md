# Govern an Agentic AI System That Earns the Right to Act

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Deploy](#deploy)
- [Repository structure](#repository-structure)
- [Tags](#tags)
- [References](#references)

## Overview

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

## Architecture

The presentation introduces the customer decision and hands the learner to a separate
Showroom journey. A deterministic qualification service evaluates signal, decision,
authority, bounded simulated action, validation or rollback, and learning against
versioned contracts. The runtime cannot promote itself: Launchpad owns participant
isolation and lifecycle, while a human reviewer owns certification and any increase in
authority.

## Requirements

- Node.js 22 and npm for the presentation and qualification service.
- Python 3 for contract and publication validation.
- Helm 3 for rendering the OpenShift package.
- An approved OpenShift destination with namespace-scoped participant access.
- Independent Agentic AI 401 and 501 certification before any live authority claim.

## Deploy

This repository is not directly orderable. Verify the immutable source locally, publish
digest-pinned AMD64 images through the release workflow, and hand the resulting receipt
to Launchpad for independent one-seat and five-seat certification. Keep authority
execution disabled until every prerequisite and human-review gate passes.

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

## Repository structure

### Factory outputs

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

## Tags

`agentic-ai`, `governance`, `human-authority`, `OpenShift`, `Intel Xeon`,
`Showroom`, `qualification`, `reversible-action`, `evidence-driven-development`

## References

- `handoff/launchpad-handoff.yaml` — fail-closed Launchpad intake proposal.
- `handoff/catalog-certification.proposed.yaml` — proposed independent scale gates.
- `contracts/authority-ladder.v1.json` — earned-authority contract.
- `tests/claim_registry.yaml` — product, research, and factory claim provenance.
