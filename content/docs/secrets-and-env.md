---
title: Secrets & Code Signing Keys
description: Securely manage Android Keystores, Apple Certificates, Provisioning Profiles, and encrypted tokens.
category: Security & Signing
order: 5
badge: Security
updatedAt: August 2026
---

# Secrets & Code Signing Keys

Security is paramount in mobile CI/CD. Flotio stores all sensitive credentials in an AES-256 encrypted vault that is injected only inside isolated ephemeral runner environments.

---

## Android Keystore Signing

To sign release Android binaries (`.apk` and `.aab`):

1. Upload your `upload-keystore.jks` or `release.keystore` in the **Secrets** section of your project.
2. Define the required environment variables:
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`

> [!TIP]
> Flotio automatically decodes and sets the keystore path in your build environment at `$FLOTIO_KEYSTORE_PATH`.

---

## iOS Apple Signing & Certificates

For iOS compilation and IPA code signing, you need:

1. **Distribution Certificate** (`.p12`): Exported from Apple Developer Portal or Keychain Access with certificate password.
2. **Provisioning Profile** (`.mobileprovision`): App Store, Ad-Hoc, or Enterprise profile.

```bash
# Automatic code signing setup on Apple Silicon runner
fastlane match appstore --readonly
```

---

## Encrypted Project Secrets

Secrets can be scoped to:
- **Global Organization**: Available across all projects.
- **Project Specific**: Isolated to a single application.
- **Branch Protected**: Only exposed when building protected release branches (e.g. `main` or `release/*`).
