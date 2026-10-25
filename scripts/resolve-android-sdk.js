/**
 * Resolve Android SDK root for React Native CLI / doctor when ANDROID_HOME is unset.
 * Used from patched @react-native-community packages (see patches/).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function isAndroidSdk(dir) {
  if (!dir || dir.includes('\n')) {
    return false;
  }
  const normalized = path.resolve(dir);
  return (
    fs.existsSync(path.join(normalized, 'build-tools')) ||
    fs.existsSync(path.join(normalized, 'platform-tools', 'adb'))
  );
}

function parseSdkDirFromProperties(content) {
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith('sdk.dir=')) {
      continue;
    }
    let sdkDir = line.slice('sdk.dir='.length).trim().replace(/\\:/g, ':');
    if (sdkDir.startsWith('"') && sdkDir.endsWith('"')) {
      sdkDir = sdkDir.slice(1, -1);
    }
    if (sdkDir && isAndroidSdk(sdkDir)) {
      return path.resolve(sdkDir);
    }
  }

  // Recover from corrupted local.properties (e.g. nvm output accidentally written).
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('/') && isAndroidSdk(line)) {
      return path.resolve(line);
    }
  }

  return null;
}

function fromLocalProperties(projectRoot) {
  if (!projectRoot) {
    return null;
  }
  const localProperties = path.join(projectRoot, 'android', 'local.properties');
  if (!fs.existsSync(localProperties)) {
    return null;
  }
  return parseSdkDirFromProperties(fs.readFileSync(localProperties, 'utf8'));
}

function fromHomebrewPlatformTools() {
  if (process.platform !== 'darwin') {
    return null;
  }
  try {
    const prefix = execSync('brew --prefix android-platform-tools 2>/dev/null', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!prefix) {
      return null;
    }
    const sdkRoot = path.resolve(prefix, '..', '..');
    return isAndroidSdk(sdkRoot) ? sdkRoot : null;
  } catch {
    return null;
  }
}

function fromCommonPaths() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    path.join(os.homedir(), 'Library', 'Android', 'sdk'),
    path.join(os.homedir(), 'Android', 'Sdk'),
    fromHomebrewPlatformTools(),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (isAndroidSdk(candidate)) {
      return path.resolve(candidate);
    }
  }
  return null;
}

function resolveAndroidSdk(projectRoot) {
  return fromLocalProperties(projectRoot) || fromCommonPaths();
}

function resolveAdbPath(sdkRoot) {
  if (sdkRoot) {
    const sdkAdb = path.join(sdkRoot, 'platform-tools', 'adb');
    if (fs.existsSync(sdkAdb)) {
      return sdkAdb;
    }
  }
  try {
    const whichAdb = execSync('command -v adb', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (whichAdb) {
      return whichAdb;
    }
  } catch {
    // ignore
  }
  return sdkRoot ? path.join(sdkRoot, 'platform-tools', 'adb') : 'adb';
}

function ensureAndroidSdkEnv(projectRoot) {
  const discovered = resolveAndroidSdk(projectRoot);
  if (!discovered) {
    return null;
  }

  process.env.ANDROID_HOME = discovered;
  process.env.ANDROID_SDK_ROOT = discovered;

  const platformTools = path.join(discovered, 'platform-tools');
  if (fs.existsSync(platformTools) && !process.env.PATH.split(path.delimiter).includes(platformTools)) {
    process.env.PATH = `${platformTools}${path.delimiter}${process.env.PATH}`;
  }

  return discovered;
}

module.exports = {
  resolveAndroidSdk,
  ensureAndroidSdkEnv,
  resolveAdbPath,
  isAndroidSdk,
};
