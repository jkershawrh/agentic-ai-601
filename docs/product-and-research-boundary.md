# Product and research boundary

Verified on 2026-09-28 against local pinned sources and authoritative product documentation.

## Supported or release-specific platform capabilities

- Red Hat OpenShift provides namespaces, RBAC, NetworkPolicy, quotas, admission, Jobs, and standard workload isolation controls.
- OpenShift sandboxed containers provides Kata-based workload isolation, subject to the target release and platform support matrix: <https://docs.redhat.com/en/documentation/openshift_sandboxed_containers/1.10/html/deploying_openshift_sandboxed_containers/deploying-osc_metal-osc>
- OpenShift GitOps, Pipelines, Logging, and OpenTelemetry-compatible collection are suitable integration surfaces, but this factory candidate does not claim a live configured instance.

## Developer Preview or research-only

- Red Hat OpenShift AI Self-Managed 3.5 lists OpenShell secure agent onboarding as a **Developer Preview** using upstream artifacts and explicitly says it is unsupported for production environments: <https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.5/html/release_notes/developer-preview-features_relnotes>
- The pinned NVIDIA OpenShell source `474d2d4ad63be1b62396f4af5085580f0847054c` labels itself **alpha**, single-player, with an experimental Kubernetes path.
- GCL is a research-oriented decision-synthesis pattern, not a verified Red Hat product.
- Agent passport is a research-oriented signed authority-envelope pattern, not a verified Red Hat product.
- Immutable ledger is an append-only evidence architecture requirement, not a named product claim.
- `rossoctl` is a proposed research CLI and is not implemented or productized here.

These labels are contractual: fixtures, presentation content, the lab, and the handoff may not promote any of these concepts to supported-product status without a new authoritative source and release-specific verification.
