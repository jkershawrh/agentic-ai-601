# Release governance

Factory release artifacts are evidence for independent review, not permission to
run production actions.

## Retention

- Retain the current successful commit-tagged GHCR release and at least two prior
  successful commit-tagged releases (three rollback releases total).
- Retain workflow SBOM artifacts through their recorded GitHub expiration date.
- Do not delete a source commit, digest, SBOM, signature, or provenance record
  referenced by an active handoff.
- Deletion requires a named human reviewer and an updated handoff.

## License review

- Every release produces an SPDX JSON inventory from the exact image digest.
- A new direct dependency must have a declared license and human review.
- Missing, unknown, or policy-incompatible license evidence blocks Launchpad
  promotion; the factory does not infer approval from package metadata.
- Launchpad retains independent authority for final license and destination
  qualification.

## Signature and provenance

Each exact image digest is signed keylessly with Sigstore using the GitHub OIDC
identity for `.github/workflows/release.yml`. The same job attaches an SLSA v1
provenance predicate and verifies both records against the expected certificate
identity and issuer before the release job can pass.
