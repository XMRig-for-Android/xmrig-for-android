# Build XMRig for Android

## Prerequisites
* NodeJS v22.17.0 (see `.nvmrc`)
* JDK 23 (JDK 17 or 21 also supported; run `source scripts/setup-java-env.sh`)
* [React Native Development Enviroment](https://reactnative.dev/docs/environment-setup)
* Android Studio
* Android SDK 37 (compile SDK; target SDK remains 36)
* Android SDK Build Tools 37.0.0
* Android NDK 27.1.12297006
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

`yarn doctor` loads the Android SDK and JDK, then runs stock `react-native doctor`. React Native's doctor still treats JDK newer than 20 as unsupported, so JDK 23 can be reported even though this project builds with it. The SDK check uses `sdkmanager` and can fail on JDK 23; `source scripts/setup-android-env.sh` writes `android/local.properties` so Gradle can find the SDK without that check.

```bash
yarn doctor
```

The **Adb** check passes only while an emulator or USB device is connected (`adb devices` shows `device`). Start the emulator before running doctor if you want a green Adb line. Keep `android/local.properties` as a single line `sdk.dir=/path/to/sdk` — do not commit it (it is gitignored). If it ever contains shell noise (e.g. from nvm), run `source scripts/setup-android-env.sh` to rewrite it.

## Build
Clone the repo

`yarn install`

### Run on Android (debug)

The debug app loads JavaScript from **Metro** on your Mac (port **8081**). If Metro is not running, you will see *Unable to load script* / *index.android.bundle*.

**Recommended** (starts Metro if needed, runs `adb reverse`, installs the app):

```bash
bash scripts/run-android-dev.sh
```

**Manual** — use two terminals:

```bash
# Terminal 1
yarn start

# Terminal 2 (physical device over USB)
adb reverse tcp:8081 tcp:8081
npx react-native run-android
```

Emulator: `adb reverse` is optional; the app uses `10.0.2.2:8081` to reach Metro on the host.

If you launch the app from Android Studio without Metro, open the dev menu (shake device or `adb shell input keyevent 82`) → **Reload**, or press **R** twice in the Metro terminal.

If you use nvm, run `nvm use` before starting Metro or Gradle.

Release builds embed the bundle; debug builds do not include `index.android.bundle` in the APK.

### Native build errors (`libc++_shared`, react-native-reanimated)

If Gradle fails on `:react-native-reanimated:configureCMakeDebug` with:

`ld.lld: error: unable to find library -lc++_shared`

the NDK install under `$ANDROID_HOME/ndk/27.1.12297006` is incomplete. Check:

```bash
bash scripts/verify-ndk.sh
```

Repair (uses JDK 17/21 — Android Studio’s bundled JBR works):

```bash
bash scripts/reinstall-ndk.sh
```

Then clean native build caches and rebuild:

```bash
rm -rf node_modules/react-native-reanimated/android/.cxx
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

Or use Android Studio → **Settings → Android SDK → SDK Tools** → toggle **NDK (Side by side) 27.1.12297006** off/on.