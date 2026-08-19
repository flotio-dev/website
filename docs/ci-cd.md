# CI and GitOps

The `CI` workflow validates the website, builds and scans one image, publishes
that exact artifact, attests its provenance and SPDX SBOM, then updates the
existing GitOps repository. It never connects to Kubernetes; Argo CD remains
the only deployment and rollback controller.

Pull requests to `main` or `dev` run lint, TypeScript, tests, the Next.js build,
dependency review, CodeQL, Trivy, the container build and image scan. They do
not publish and cannot access GitOps. Pushes to `dev` update
`manifest/dev/website/deploy-front.yaml`; pushes to `main` wait for approval in
the protected `production` environment before updating the production file.
A strict `vX.Y.Z` tag aliases the existing attested SHA image without rebuilding.

Published images use `ghcr.io/flotio-dev/website-next:sha-<full-git-sha>`.
GitOps receives only `ghcr.io/flotio-dev/website-next@sha256:<digest>`.

Required configuration:

- variable `GH_APP_CLIENT_ID` and secret `GH_APP_PRIVATE_KEY`;
- optional public `DEV_NEXT_PUBLIC_API_URL`, `DEV_NEXT_PUBLIC_APP_URL`,
  `PROD_NEXT_PUBLIC_API_URL` and `PROD_NEXT_PUBLIC_APP_URL` variables;
- a GitHub App installed only on `flotio-dev/k8s_config`, with Contents write,
  and allowed to bypass its main-branch ruleset for this direct handoff;
- protected `main`, `dev`, `v*` and `production`, with `ci-success` required;
- Secret Scanning, Push Protection, Dependabot security updates and the
  versioned CodeQL workflow enabled. Do not also enable CodeQL default setup.

No security exceptions are active. Future `.trivyignore.yaml` entries must
identify the finding and include `Owner`, `Justification` and `expired_at`.

Local checks:

```bash
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
docker build --pull -t website:local .
actionlint .github/workflows/ci.yaml
```

Release procedure: merge the commit to `main`, wait for `ci-success`, then
create and push an explicit signed or annotated `vX.Y.Z` tag. The tag adds an
alias only; it creates neither another image nor a GitOps change.
