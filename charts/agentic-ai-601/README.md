# Agentic AI 601 Helm chart

The chart deploys the presentation and synthetic qualification service as
separate, non-root, read-only workloads using digest-pinned Linux AMD64 images.
The only supported mode is rehearsal: the values schema requires
`authorityExecutionEnabled: false`.

The checked-in all-zero digests are deliberately non-runnable until a reviewed
release supplies exact image digests. This chart installs no external remediation
target, OpenShell runtime, agent passport, or immutable-ledger product. It does
not change Launchpad certification state.
