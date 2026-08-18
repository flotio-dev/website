---
title: Flutter Android Build Configuration
description: Master build flavors, SDK versions, Dart defines, App Bundles (AAB), and code signing for Android.
category: Configuration
order: 3
badge: Technical
updatedAt: August 2026
---

# Flutter Android Build Configuration

Flotio provides high-performance Flutter build pipelines with full control over Android output formats (AAB / APK), Gradle flavors, Dart defines, ProGuard obfuscation, and automated signing.

---

## 1. Output Format: App Bundle (AAB) vs APK

You can configure your target output format in **Project > Configuration > Build Defaults**:

- **AAB (Android App Bundle)**: Recommended for Google Play Store publishing. Generates dynamic split APKs tailored to user devices.
  ```bash
  flutter build appbundle --release
  ```
- **APK (Universal Binary)**: Recommended for QA testing, internal distribution, and direct installation on Android devices.
  ```bash
  flutter build apk --release
  ```

---

## 2. Flutter SDK Version Selection

Lock your build pipeline to a specific Flutter SDK release or channel:

```yaml
# .flotio.yaml (optional repository config)
flutter:
  channel: stable
  version: "3.29.0"
  java_version: "17"
```

---

## 3. Build Flavors & Entrypoints

If your Flutter application uses Gradle flavors (e.g. `dev`, `staging`, `production`), specify the target entrypoint and flavor in your build arguments:

```bash
# Android Flavor build targeting a specific main entrypoint
flutter build appbundle --flavor production -t lib/main_production.dart --release
```

> [!IMPORTANT]
> Ensure your Android `android/app/build.gradle` flavor dimensions match the flavor names specified in Flotio.

---

## 4. Version Code & Version Name Overrides

Easily inject semantic version names and incrementing version codes without modifying `pubspec.yaml`:

```bash
# Injected automatically by Flotio
flutter build appbundle --release --build-name=2.1.0 --build-number=42
```

---

## 5. Dart Defines & Compile-Time Constants

Inject compile-time variables safely without committing sensitive keys into your Git repository:

```bash
# Custom Dart Defines in Flotio Build Arguments
--dart-define=API_URL=https://api.flotio.dev --dart-define=ENABLE_ANALYTICS=true
```

In your Flutter code:
```dart
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'https://dev.api.flotio.dev');
const enableAnalytics = bool.fromEnvironment('ENABLE_ANALYTICS', defaultValue: false);
```
