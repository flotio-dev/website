---
title: Flotio CLI Reference
description: Complete command-line interface guide for Flotio continuous deployment and builds.
category: Tooling
order: 4
badge: CLI
updatedAt: August 2026
---

# Flotio CLI Reference

The **Flotio CLI** brings cloud builds, logs streaming, and project management directly into your command line.

---

## Installation

Install Flotio CLI globally via npm or homebrew:

```bash
# Via NPM
npm install -g @flotio/cli

# Verify installation
flotio --version
```

---

## Authentication

Authenticate with your Flotio account:

```bash
# Interactive terminal login
flotio login

# Or with personal API token
flotio login --token=flotio_tok_xxxxxxxxxxxx
```

---

## Key Commands

### `flotio run`
Starts a build for the current project in the working directory:

```bash
flotio run --branch=main --target=release
```

### `flotio logs`
Streams live build logs from an active build ID:

```bash
flotio logs --build=142 --follow
```

### `flotio projects`
Lists all connected projects:

```bash
flotio projects list
```

### `flotio artifacts`
Downloads compiled build packages:

```bash
flotio artifacts download --build=142 --out=./build/release.apk
```

---

## CLI Environment Variables

| Variable | Description |
| :--- | :--- |
| `FLOTIO_TOKEN` | Personal access token for CI/headless environments |
| `FLOTIO_API_URL` | Custom API endpoint for enterprise self-hosted instances |
| `FLOTIO_PROJECT_ID` | Target project identifier |
