---
title: Quickstart Guide
description: Connect a Git repository and run your first automated Flutter build in less than 5 minutes.
category: Getting Started
order: 2
badge: 5 min guide
updatedAt: August 2026
---

# Quickstart Guide

Get up and running with Flotio in less than 5 minutes. This guide walks you through connecting your repository, setting up your project, and triggering your first release build.

---

## Step 1: Sign up & Log into Flotio

Navigate to the Flotio dashboard and sign in with your credentials or connect your GitHub account.

> [!TIP]
> Connecting your GitHub account automatically enables repository webhooks and branch triggers for pull requests.

---

## Step 2: Create a New Project

1. Click on **New Project** in the sidebar.
2. Select your repository provider (e.g. GitHub or Custom Git URL).
3. Choose your Flutter repository and specify the default branch (e.g. `main`).
4. Flotio will automatically detect your `pubspec.yaml` and configure the default Flutter SDK version.

---

## Step 3: Configure Build Targets

In the project settings, specify the platforms you want to compile:

| Platform | Target Output | Recommended Runner |
| :--- | :--- | :--- |
| **Android** | App Bundle (`.aab`) / APK (`.apk`) | Linux Standard (High CPU, 8GB RAM) |
| **Web** | Production Web Archive (`.tar.gz`) | Linux Standard |

---

## Step 4: Trigger Your First Build

You can trigger a build in two ways:

### Method A: Via Web Dashboard
Click the **Start Build** button in the project overview. Choose your branch and target platform (e.g. Android Release AAB / APK).

### Method B: Via Flotio CLI
```bash
# Authenticate CLI
flotio login

# Start a build from your local repo directory
flotio run --branch main --platform android
```

---

## Step 5: Download Artifacts & Deploy

Once the build completes successfully:
- Inspect the real-time step-by-step logs and execution times.
- Download the generated `.aab` or `.apk` directly from the **Artifacts** tab.
- If Google Play publishing is enabled, the release will be submitted directly to your selected track (Internal, Alpha, Beta, Production).
