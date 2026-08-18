---
title: Flutter Build Configuration
description: Master build flavors, SDK versions, Dart defines, and code signing for Android & iOS.
category: Configuration
order: 3
badge: Technical
updatedAt: August 2026
---

# Flutter Build Configuration

Flotio supports advanced Flutter multi-target workflows including flavors, custom Dart defines, obfuscation, and automated signing.

---

## Flutter SDK Version Selection

You can lock your build to a specific Flutter SDK channel or semantic version in your project configuration:

```yaml
# .flotio.yaml configuration file (optional)
flutter:
  channel: stable
  version: "3.29.0"
  java_version: "17"
```

---

## Build Flavors & Schemes

If your Flutter app uses flavors (e.g. `dev`, `staging`, `production`), you can configure distinct build parameters:

```bash
# Android flavor build
flutter build apk --flavor production -t lib/main_production.dart

# iOS scheme build
flutter build ipa --flavor production --export-options-plist=ios/ExportOptions.plist
```

> [!IMPORTANT]
> Make sure your Android `app/build.gradle` flavor dimensions and Xcode Schemes match the flavor names specified in Flotio configuration.

---

## Dart Defines & Environment Variables

Inject compile-time constants safely without committing sensitive keys into your Git repository:

```bash
# Flotio CLI with Dart Defines
flotio build --dart-define=API_URL=https://api.flotio.dev --dart-define=ENABLE_ANALYTICS=true
```

In your Dart code:
```dart
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'https://dev.api.flotio.dev');
const enableAnalytics = bool.fromEnvironment('ENABLE_ANALYTICS', defaultValue: false);
```
