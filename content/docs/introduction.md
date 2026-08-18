---
title: Introduction to Flotio
description: Discover Flotio, the modern CI/CD & cloud build platform built specifically for Flutter mobile applications.
category: Getting Started
order: 1
badge: Overview
updatedAt: August 2026
---

# Welcome to Flotio

**Flotio** is the continuous integration and delivery platform engineered from the ground up for **Flutter developers and mobile engineering teams**.

Building mobile applications at scale requires specialized infrastructure: macOS hardware for iOS builds, complex Android SDK toolchains, secure Keystore management, and fast feedback loops. Flotio abstracts all this complexity so you can focus on writing Dart code.

> [!NOTE]
> Flotio provides zero-configuration build runners with pre-installed Flutter SDKs (Stable, Beta), Java 17/21, Xcode toolchains, and Android SDK command-line tools.

---

## Core Capabilities

- **Dedicated Flutter Runners**: Fast cloud build workers running Linux for Android and Apple Silicon M2 for iOS.
- **Flotio CLI**: Seamless terminal tool to trigger, monitor, and stream builds directly from VS Code, Cursor, Android Studio, or standard terminals.
- **Automated Code Signing**: Encrypted vault for your `.keystore`, Apple Developer Certificates (`.p12`), and Provisioning Profiles (`.mobileprovision`).
- **Real-Time Logs & Step Execution**: Live streaming of `flutter pub get`, `flutter test`, and build step progress with instant artifact downloads.
- **Pay-as-you-go Pricing**: Generous free tier and pay-per-minute execution for maximum cost efficiency.

---

## Architecture Overview

Flotio operates across three seamless layers:

1. **The Web Console & API**: Manage projects, configure build flavor workflows, set environment variables, and inspect build history.
2. **The Build Engine & Daemon**: Orchestrates containerized Linux and isolated Apple Silicon runners that check out your repository, compile target artifacts, sign binaries, and upload release packages.
3. **The Developer Tooling (CLI)**: Trigger manual or automated runs directly from local machines without leaving your code editor.

```bash
# Trigger an Android APK build with Flotio CLI
flotio build --platform=android --target=release
```

---

## Next Steps

- Follow the [Quickstart Guide](/docs/quickstart) to connect your first Flutter project.
- Learn how to configure [Flutter Builds & Flavors](/docs/flutter-configuration).
- Explore the [Flotio CLI Reference](/docs/cli).
