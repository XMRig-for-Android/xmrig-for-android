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

```bash
source scripts/setup-android-env.sh
source scripts/setup-java-env.sh
```

Or one line: `eval "$(scripts/setup-android-env.sh --print)" && eval "$(scripts/setup-java-env.sh --print)"`

## Build
Clone the repo

`yarn install`

Start meteor server
`yarn start`

If you use nvm - open Android Studio from terminal after running `nvm use`.

Run Android Emulator
`npx react-native run-android`