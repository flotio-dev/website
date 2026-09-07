---
title: Flotio CLI Reference
description: Complete command-line interface guide for Flotio continuous deployment, Android builds, and cloud infrastructure.
category: Tooling
order: 4
badge: CLI
updatedAt: August 2026
---

# Flotio CLI Reference

The **Flotio CLI** (`flotio`) brings cloud builds, real-time log streaming, Android keystore signing, and project infrastructure directly into your terminal.

---

## Installation

Flotio CLI is distributed as a standalone binary or installable via Go:

```bash
# Via Go toolchain
go install github.com/flotio-dev/cli/cmd/flotio@latest

# Or download the precompiled binary from GitHub Releases
curl -fsSL https://get.flotio.dev | sh

# Verify installation
flotio --version
```

### Global Flags

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--config` | Custom configuration file path | `$HOME/.flotio/config.yaml` |
| `--host` | Target Flotio API server URL | `https://api.flotio.ovh` |
| `-o`, `--output` | Output format (`table` or `json`) | `table` |

---

## Diagnostics & Health

Use the **doctor** command to verify your local CLI credentials, network reachability, and cluster API status:

```bash
flotio doctor
```

Output checks:
- Configuration path and active API host
- Stored JWT access and refresh token validity
- Server connectivity (`/healthz`)

---

## Authentication

Authenticate with your Flotio credentials. Tokens are encrypted and stored in `~/.flotio/auth.json`:

```bash
# Interactive or flag-based login
flotio login --email you@example.com --password "your-password"
flotio login -e you@example.com -p "your-password"

# Clear session and revoke tokens
flotio logout
```

---

## Project Management

### Initialize Local Directory

Link your local Flutter repository to a Flotio project by generating a local `.flotio.yaml`:

```bash
# Interactive prompt
flotio init

# Or directly specify project ID
flotio init 42
```

### Manage Projects

```bash
# List all connected projects
flotio project list

# View project details and configuration
flotio project get [project-id]

# Create a new project
flotio project create "My Flutter App" --repo https://github.com/org/repo --platform android

# Update project settings
flotio project update [project-id] --name "Updated Name"

# Delete a project
flotio project delete [project-id]
```

---

## Android Builds

Trigger and monitor mobile build pipelines running on Flotio's dedicated Kubernetes runners:

### Trigger a Build

```bash
# Trigger an Android release build (App Bundle by default)
flotio build start --branch main --platform android --mode release --target aab

# Trigger a universal APK build
flotio build start [project-id] --branch main --platform android --mode release --target apk
```

### Build Flags

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--branch`, `-b` | Git branch to checkout and build | `main` |
| `--platform` | Target platform (`android`) | `android` |
| `--mode` | Build mode (`release`, `debug`, `profile`) | `release` |
| `--target` | Output artifact format (`apk` or `aab`) | `apk` |

### Monitor & Download Builds

```bash
# List recent builds for the current or specified project
flotio build list
flotio build list 42

# Stream live build logs in real time
flotio build logs 142

# Download compiled APK / AAB artifact
flotio build download 142 --out ./release.apk

# Cancel a running build
flotio build cancel 142

# Delete a build record
flotio build delete 142
```

---

## Keystores & Code Signing

Manage Android release keystores (`.jks` / `.keystore`) securely in the cloud:

```bash
# List stored signing keys
flotio keystore list

# Upload a release keystore
flotio keystore create "production-key" --file ./upload-keystore.jks --alias release-key

# Delete a keystore
flotio keystore delete 1
```

---

## Google Play Publishing

Distribute successful builds directly to Google Play Store tracks:

```bash
# Upload service account JSON credentials
flotio play create "play-service-account" --file ./play-service-account.json

# List configured Play Store credentials
flotio play list

# Publish a build to a Google Play track (internal, alpha, beta, production)
flotio release publish [project-id] <build-id> --track production --notes "Performance improvements & bug fixes"
```

---

## Build Cache Management

Speed up Gradle and Flutter dependency builds using Flotio's distributed cache:

```bash
# View cache usage and hit-rate metrics
flotio cache metrics

# Purge dependency cache for a specific branch
flotio cache purge --branch main
```

---

## Environment Variables & Secret Files

Inject compile-time secrets, Dart defines, and configuration files into build pods:

```bash
# List environment variables
flotio env list

# Set an environment variable
flotio env create API_URL "https://api.myapp.com"

# Upload a secure file (e.g. google-services.json)
flotio env create google-services.json @./android/app/google-services.json --type file --path android/app/google-services.json

# Delete a variable or secret file
flotio env delete 1
```

---

## Flutter SDK Management

Query supported Flutter versions available on the build cluster:

```bash
flotio flutter versions
```

