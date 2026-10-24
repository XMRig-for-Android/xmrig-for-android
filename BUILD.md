# Build XMRig for Android

## Prerequisites
* NodeJS v22.17.0 (see `.nvmrc`)
* JDK 23 (JDK 17 or 21 also supported; run `source scripts/setup-java-env.sh`)
* [React Native Development Enviroment](https://reactnative.dev/docs/environment-setup)
* Android Studio
* Android SDK 36
* Android SDK Build Tools 36.0.0
* Android NDK 27.0.12077973
* CMake 3.22 or newer
* `autoconf`, `automake`, and `libtool` (needed when building hwloc from git)

## Build XMRig
This script will compile hwloc, libuv, openssl, xmrig, and xmrig-mo for each ABI and copy the binaries to the `jniLibs` folder in the Android project.
```
cd xmrig/lib-builder
make
```


## Environment

From the repo root, load the Android SDK and JDK into your shell:

In **zsh** (Cursor’s default), `source scripts/setup-android-env.sh` is supported: the script re-invokes itself under **bash** and only `return`s to your shell (it never calls `exit` in the parent).

You can also use:

```bash
eval "$(scripts/setup-android-env.sh --print)"
eval "$(scripts/setup-java-env.sh --print)"
```

### React Native doctor

Stock `npx react-native doctor` (RN 0.77) does not recognize JDK 23 and uses `sdkmanager` to detect the Android SDK, which often fails on JDK 23. This repo patches the doctor checks and provides a wrapper that sets `ANDROID_HOME` first:

```bash
yarn doctor
```

After `yarn install`, run `yarn doctor` rather than bare `npx react-native doctor`.

Doctor discovers the SDK from `android/local.properties` or the default macOS/Linux SDK paths even when `ANDROID_HOME` is unset in your shell. Run `source scripts/setup-android-env.sh` once to write `local.properties`.

The **Adb** check only passes while an emulator or USB device is connected (`adb devices` shows `device`). Start the emulator before running doctor if you want a green Adb line; if nothing is connected, it is reported as a warning, not a build blocker.

If `which adb` is Homebrew (`/opt/homebrew/bin/adb`) that is fine; doctor falls back to it when the SDK copy is missing. Keep `android/local.properties` as a single line `sdk.dir=/path/to/sdk` — do not commit it (it is gitignored). If it ever contains shell noise (e.g. from nvm), run `source scripts/setup-android-env.sh` to rewrite it.

## Build
Clone the repo

`yarn install`

Start meteor server
`yarn start`

If you use nvm - open Android Studio from terminal after running `nvm use`.

Run Android Emulator
`npx react-native run-android`