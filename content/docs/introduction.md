---
title: Introduction to Flotio
description: Discover Flotio, the modern CI/CD & cloud build platform built specifically for Flutter mobile applications.
category: Getting Started
order: 1
badge: Overview
updatedAt: August 2026
---

# Welcome to Flotio

**Flotio** is the continuous integration and delivery platform engineered from the ground up for **Flutter developers and Android mobile engineering teams**.

Building mobile applications at scale requires specialized infrastructure: complex Android SDK toolchains, secure Keystore management, Gradle caching, and automated distribution to the Google Play Store. Flotio abstracts all this complexity so you can focus on writing Dart code.

> [!NOTE]
> Flotio provides zero-configuration build runners with pre-installed Flutter SDKs (Stable, Beta), Java 17/21, Gradle, and Android SDK command-line tools.

---

## Core Capabilities

- **Dedicated Cloud Runners**: High-speed Linux build workers optimized for Flutter and Android Gradle compilation.
- **Flotio CLI**: Seamless terminal tool to trigger, monitor, and stream builds directly from VS Code, Cursor, Android Studio, or standard terminals.
- **Automated Code Signing**: Encrypted vault for your Android Keystores (`.jks`), key aliases, and signing passwords.
- **Google Play & Firebase Integration**: Native support for Google Cloud service account keys, automated Play Store track releases (Internal, Alpha, Beta, Production), and `google-services.json`.
- **Real-Time Logs & Step Execution**: Live streaming of `flutter pub get`, `flutter test`, and build step progress with instant artifact downloads (APK & AAB).

---

## Architecture Overview

Flotio operates across three seamless layers:

1. **The Web Console & API**: Manage projects, configure build flavor workflows, set environment variables, upload Keystores, and inspect build history.
2. **The Build Engine & Daemon**: Orchestrates containerized Linux runners that check out your repository, compile target artifacts (AAB / APK), sign binaries, and upload release packages to Google Play or cloud storage.
3. **The Developer Tooling (CLI)**: Trigger manual or automated runs directly from local machines without leaving your code editor.

```bash
# Trigger an Android release build with Flotio CLI
flotio build --platform=android --target=aab --mode=release
```

---

## Next Steps

- Follow the [Quickstart Guide](/docs/quickstart) to connect your first Flutter project.
- Learn how to configure [Flutter Builds & Flavors](/docs/flutter-configuration).
- Secure your app with [Secrets, Keystores & Google Play](/docs/secrets-and-env).
- Explore the [Flotio CLI Reference](/docs/cli).
