---
title: Secrets, Keystores & Google Play
description: Securely manage Android Keystores, Google Play Service Account keys, Firebase configurations, and encrypted environment variables.
category: Security & Signing
order: 5
badge: Security
updatedAt: August 2026
---

# Secrets, Keystores & Google Play Distribution

Security is paramount in mobile CI/CD. Flotio stores all sensitive credentials in an AES-256 encrypted vault that is decrypted and mounted only inside isolated ephemeral runner containers at build time.

---

## 1. Android Keystore Signing (.jks)

To produce signed release binaries (`.apk` and `.aab` for Google Play), Flotio provides a dedicated Keystore Manager.

### Generating a Keystore (if you don't have one)
```bash
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-app-alias
```

### Adding your Keystore to Flotio
1. Navigate to **Project > Configuration > Android Keystores & Signing**.
2. Click **+ Upload Keystore** and provide:
   - **Name**: e.g. `Production Key`
   - **Keystore File**: Select your `.jks` file
   - **Store Password**: Keystore encryption password
   - **Key Alias**: Alias name specified during generation (e.g. `my-app-alias`)
   - **Key Password**: Alias password (if different from store password)
3. Click **Link Keystore** to associate it with your project.

> [!TIP]
> During compilation, Flotio automatically mounts the keystore at `/keystore/keystore.jks` and sets `$KEYSTORE_PATH`, `$KEYSTORE_PASSWORD`, `$KEY_ALIAS`, and `$KEY_PASSWORD`.

---

## 2. Google Cloud & Google Play Service Account

Automated publishing to the Google Play Store requires a Google Cloud Service Account linked to your Google Play Developer Console.

### Step 1: Create a Service Account in Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project and navigate to **IAM & Admin > Service Accounts**.
3. Click **Create Service Account**:
   - Name: `flotio-play-publisher`
   - Grant role: `Service Account User`.
4. Navigate to the **Keys** tab of the created service account.
5. Click **Add Key > Create new key > JSON** and download the `.json` key file.

### Step 2: Enable Google Play Android Developer API
1. In Google Cloud Console, navigate to **APIs & Services > Library**.
2. Search for **Google Play Android Developer API** and click **Enable**.

### Step 3: Grant Permissions in Google Play Console
1. Open the [Google Play Console](https://play.google.com/console).
2. Navigate to **Users & Permissions > Invite new user**.
3. Paste the email address of the service account created in Google Cloud (e.g. `flotio-play-publisher@...iam.gserviceaccount.com`).
4. In **App permissions**, select your app and grant the following permissions:
   - *Edit and delete draft releases*
   - *Release to production, exclude devices, and use Play App Signing*
   - *Release apps to testing tracks (Internal, Closed, Open)*
5. Click **Invite user** to confirm.

### Step 4: Add the Key to Flotio
1. In your Flotio Project, go to **Configuration > Distribution & Store Publishing**.
2. Under **Google Play Service Account Key (JSON)**, click **+ Add Key**.
3. Enter a name (e.g. `Play Store Console Key`) and upload your JSON file.
4. Select the track for automated deployment:
   - `internal` (Internal Testing track - recommended for CI/CD)
   - `alpha` (Closed Testing)
   - `beta` (Open Testing)
   - `production` (Direct Production release)
5. Set your **Rollout Fraction** (e.g. `1.0` for 100% or `0.1` for 10% staged rollout).

---

## 3. Firebase Integration (google-services.json)

For Flutter apps using Firebase (Authentication, Firestore, Cloud Messaging, Crashlytics):

1. Download your `google-services.json` from the Firebase Console.
2. In Flotio, navigate to **Project > Configuration > Environment Variables & Files**.
3. Upload `google-services.json` as a secure file asset.
4. Flotio automatically mounts all uploaded environment files into `/env-files/` and copies `google-services.json` to `android/app/google-services.json` before building.

---

## 4. Encrypted Environment Variables

You can inject environment variables into your Flutter build via Dart defines:

```bash
# Injected via Flotio Build Arguments
--dart-define=API_URL=https://api.myapp.com --dart-define=APP_ENV=production
```

All keys and tokens are AES-256 encrypted at rest and never exposed in build logs.
