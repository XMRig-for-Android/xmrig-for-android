# Build XMRig for Android

## Prerequisites
* NodeJS v22.17.0 (see `.nvmrc`)
* JDK 17
* [React Native Development Enviroment](https://reactnative.dev/docs/environment-setup)
* Android Studio
* Android SDK 35
* Android SDK Build Tools 35.0.0
* Android NDK 27.0.12077973
* CMake 3.22 or newer
* `autoconf`, `automake`, and `libtool` (needed when building hwloc from git)

## Build XMRig
This script will compile hwloc, libuv, openssl, xmrig, and xmrig-mo for each ABI and copy the binaries to the `jniLibs` folder in the Android project.
```
cd xmrig/lib-builder
make
```


## Build
Clone the repo

`yarn install`

Start meteor server
`yarn start`

If you use nvm - open Android Studio from terminal after running `nvm use`.

Run Android Emulator
`npx react-native run-android`