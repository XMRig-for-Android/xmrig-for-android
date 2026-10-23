.PHONY: all toolchain libuv hwloc openssl xmrig xmrig-mo install clean

all: clean install

toolchain:
	./build.sh toolchain

libuv:
	./build.sh libuv

hwloc:
	./build.sh hwloc

openssl:
	./build.sh openssl

xmrig: libuv hwloc openssl
	./build.sh xmrig

xmrig-mo: libuv hwloc openssl
	./build.sh xmrig-mo

install: xmrig xmrig-mo
	./build.sh install

clean:
	./build.sh clean
