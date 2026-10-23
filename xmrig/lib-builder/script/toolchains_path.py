#!/usr/bin/env python3
"""
    Get the toolchains path
"""
import argparse
import os
import sys


def get_host_tag_or_die(ndk):
    """Return the host tag for this platform. Die if not supported."""
    if sys.platform.startswith('linux'):
        candidates = ['linux-x86_64']
    elif sys.platform == 'darwin':
        # NDK r23+ ships universal Darwin binaries under darwin-x86_64.
        candidates = ['darwin-x86_64', 'darwin-arm64']
    elif sys.platform == 'win32' or sys.platform == 'cygwin':
        candidates = ['windows-x86_64', 'windows']
    else:
        sys.exit('Unsupported platform: ' + sys.platform)

    for host_tag in candidates:
        if os.path.exists(os.path.join(ndk, 'toolchains', 'llvm', 'prebuilt', host_tag)):
            return host_tag
    sys.exit('Could not find an NDK host tag under {}'.format(ndk))


def get_toolchain_path_or_die(ndk, host_tag):
    """Return the toolchain path or die."""
    toolchain_path = os.path.join(ndk, 'toolchains/llvm/prebuilt', host_tag)
    if not os.path.exists(toolchain_path):
        sys.exit('Could not find toolchain: {}'.format(toolchain_path))
    return toolchain_path


def main():
    """Program entry point."""
    parser = argparse.ArgumentParser(description='Print the NDK LLVM toolchain path')
    parser.add_argument('--ndk', required=True, help='The NDK Home directory')
    args = parser.parse_args()

    host_tag = get_host_tag_or_die(args.ndk)
    toolchain_path = get_toolchain_path_or_die(args.ndk, host_tag)
    print(toolchain_path)


if __name__ == '__main__':
    main()
